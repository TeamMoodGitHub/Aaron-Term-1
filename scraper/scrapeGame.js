const cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');
const updateChampInfo = require('./updateChampInfo');

//Update this with patch date to parse games only from current patch.
const patchTime = new Date("August 24, 2017").getTime();

//Delay in ms to prevent surpassing Riot API Limit.
//Current development limit: 100 requests/2 mins = 5/6 requests per second = 1.2 seconds / request
const delay = 1.2 * 1000;

const matchURL = (matchID) => "https://na1.api.riotgames.com/lol/match/v3/matches/"+ matchID +"?api_key="+ RIOT_API_KEY;
const historyURL = (accountID) => "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/"+ accountID + "?beginTime="+patchTime+"&api_key=" + RIOT_API_KEY;
const patchURL = "https://ddragon.leagueoflegends.com/api/versions.json";

var currentPatch;

function getCurrentPatch() {
	return new Promise(function (resolve, reject) { 
		https.get(patchURL, function(res) {
			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					reject("Failed to get current patch: " + body);
					return;
				}

				//Otherwise, parse the data!
				var data = JSON.parse(body);
				currentPatch = data[0];
				console.log("Current patch: " + currentPatch);
				resolve();

			});
		}).on('error', function(e) {
			reject("Error pulling match history for user: " + userID + " from Riot API: " + e);
		});
	});
}

function scrapeNextGame() {
	return new Promise(function (resolve, reject) {
		const query = {
			scraped: false,
			patch: currentPatch
		};
		const update = {
			$set: {
				scraped: true
			}
		};
		//Sort by last search time ascending.
		const options = null;

		db.collection('scraperGames').findOneAndUpdate(query, update, options, function(err, results) {
			if (err) {
				reject("Error retrieving next game to scrape: " + err);
			} else {
				if (results.value) {
					resolve(results.value.matchID);
				}
				else {
					resolve(false);
				}
			}
		});
	});
}

function scrapeNextUser() {
	return new Promise(function(resolve, reject) {
		const query = {};
		const update = {
			$set: {
				lastSearch: new Date().getTime()
			}
		};
		//Sort by last search time ascending.
		const options = {
			sort: {
				lastSearch: 1
			}
		};

		db.collection('scraperUsers').findOneAndUpdate(query, update, options, function(err, results) {
			if (err) {
				reject("Error retrieving next user to scrape: " + err);
			} else {
				const oneDay = 1000 * 60 * 60 * 24;
				//If last search is more recent than a day, return false.
				if (results.value.lastSearch > new Date().getTime() - oneDay) {
					resolve(false);
					return;
				}
				resolve(results.value.userID);
			}
		});
	});
}

function insertUserToScrape(id) {
	db.collection('scraperUsers').findOneAndUpdate({
		userID: id
	}, {
		$setOnInsert: {
			lastSearch: -1
		}
	}, {
		upsert: true
	});
}

function insertMatchToScrape(id) {
	db.collection('scraperGames').findOneAndUpdate({
		matchID: id,
	}, {
		$setOnInsert: {
			scraped: false,
			patch: currentPatch
		}
	}, {
		upsert: true
	});
}

function parseUserByID(userID) {
	return new Promise(function(resolve, reject) {
		https.get(historyURL(userID), function(res) {

			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					reject("Could not parse user " + userID + ". Status Code: " + res.statusCode + ". Contents of body: " + body);
				}

				//Otherwise, parse the data!
				var data = JSON.parse(body);
				//console.log(JSON.stringify(userID) + " !! " + JSON.stringify(data));
				for (var i=0;i<data.matches.length;i++) {
					insertMatchToScrape(data.matches[i].gameId);
				}
				console.log("Inserted " + data.matches.length + " matches from accountID: " + userID);
				resolve();

			});
		}).on('error', function(e) {
			reject("Error pulling match history for user: " + userID + " from Riot API: " + e);
		});
	});
}

function parseGameByID(gameID) {
	return new Promise(function(resolve, reject) {
		https.get(matchURL(gameID), function(res) {

			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					reject("Could not parse match " + gameID + ". Status Code: " + res.statusCode + ". Contents of body: " + body);
					return;
				}

				//Otherwise, parse the data!
				var data = JSON.parse(body);

				for (var i=0;i<data.participantIdentities.length;i++) {
					insertUserToScrape(data.participantIdentities[i].player.currentAccountId);
					//console.log("Added Account ID " + data.participantIdentities[i].player.currentAccountId + " to scrape.");
				}

				if (!data.gameVersion.startsWith(currentPatch)) {
					console.log(data.gameVersion + " < " + currentPatch + ". Skipping.");
					resolve();
					return;
				}
				console.log("Scraped game ID: " + data.gameId);
				resolve();

			});
		}).on('error', function(e) {
			reject("Error pulling match history for user: " + gameID + " from Riot API: " + e);
		});
	});
}

async function scrapeAllGames() {
	while (id = await scrapeNextGame()) {
		await parseGameByID(id);
		await sleep(delay);
	}
}

async function scrapeUsers(n=10) {
	for (var i=0;i<n;i++) {
		const id = scrapeNextUser();
		if (await id) {
			await parseUserByID(await id);
		} else {
			return i+1;
		}
		await sleep(delay);
	}
	return n;
}

async function startScraping() {
	while (true) {
		const n = scrapeUsers(10)
		if (await n == 0) {
			return;
		} else {
			await scrapeAllGames();
		}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;

	getCurrentPatch()
	.then(startScraping)
	.then(() => console.log("Done scraping."))
	.catch((err) => console.log("Error on promise chain: " + err));
	

});