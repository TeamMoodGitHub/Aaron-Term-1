const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');

//Update this with patch date to parse games only from current patch.
const patchTime = new Date("August 24, 2017").getTime();

//Delay in ms to prevent surpassing Riot API Limit.
//Current development limit: 50 requests / second = 1 requests / 0.02 seconds
const delay = 0.02 * 1000;

const matchURL = (matchID) => "https://na1.api.riotgames.com/lol/match/v3/matches/"+ matchID +"?api_key="+ RIOT_API_KEY;
const historyURL = (accountID) => "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/"+ accountID + "?beginTime="+patchTime+"&api_key=" + RIOT_API_KEY;
const patchURL = "https://ddragon.leagueoflegends.com/api/versions.json";
const champsURL = (patchNumber) => "https://ddragon.leagueoflegends.com/cdn/"+patchNumber+"/data/en_US/champion.json";

//Summoner Spell ID for SMITE from: http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json
const SMITE = 11;

var currentPatch;
var champIDs;

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

async function getChampionIDs() {
	await https.get(champsURL(currentPatch), function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {

			//If response code isn't 2XX, there is a problem!
			if (res.statusCode < 200 || res.statusCode > 299) {
				reject("Failed to get current champ IDs: " + body);
				return;
			}

				//Otherwise, parse the data!
			var data = JSON.parse(body);
			champIDs = Object.values(data.data);
			console.log("Num of Champs: " + champIDs.length);
			return;

		});
	}).on('error', function(e) {
		reject("Error pulling match history for user: " + userID + " from Riot API: " + e);
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

function addJunglerWin(champid) {
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			wins: 1
		}
	}
	const options = {
		upsert: true
	}
	db.collection("junglerStats").updateOne(query, update, options);
}
function addJunglerGame(champid){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			games: 1
		}
	}
	const options = {
		upsert: true
	}
	db.collection("junglerStats").updateOne(query, update, options);
}
function addChampionWin(champid){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			wins: 1
		}
	}
	const options = {
		upsert: true
	}
	db.collection("champStats").updateOne(query, update, options);
}
function addChampionGame(champid){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			games: 1
		}
	}
	const options = {
		upsert: true
	}
	db.collection("champStats").updateOne(query, update, options);
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
				var count=0;
				for (var i=0;i<data.matches.length;i++) {
					if (isRanked(data.matches[i].queue)) {
						insertMatchToScrape(data.matches[i].gameId);
						count++;
					}
				}
				console.log("Inserted " + count + " matches from accountID: " + userID);
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
				//SCRAPE RANKED GAME DATA HERE
				//GRAB DATA ONLY FOR CHAMPIONS THAT ARE JUNGLING

				//var winningTeam = data.teams[0].win === "Win" ? data.teams[0].teamId : data.teams[1].teamId;

				
				for (var i=0;i<data.participants.length;i++) {

					if (data.participants[i].spell1Id === SMITE || data.participants[i].spell2Id === SMITE) {
						//1. For each jungler, add to victory/total to champ in champWinRate collection. Update total.
						if (data.participants[i].stats.win) {
							addJunglerWin(data.participants[i].championId);
							//console.log("Added Jungler Win.");
						}
						addJunglerGame(data.participants[i].championId);
						//console.log("Added Jungler Game.");
					}

					//3. For each player, add to victory/total to champ in champWinRate collection. Update total.
					if (data.participants[i].stats.win) {
						addChampionWin(data.participants[i].championId);
						//console.log("Added Champion Win.");
					}
					addChampionGame(data.participants[i].championId);
					//console.log("Added Champion Game.");
				}
				
				
				//Repeat in Plat+ set of collection if champion is in plat+
				console.log("Scraped game ID: " + data.gameId);
				resolve();

			});
		}).on('error', function(e) {
			reject("Error pulling match history for user: " + gameID + " from Riot API: " + e);
		});
	});
}

function isRanked(queue) {
	//IDs mapped from https://developer.riotgames.com/game-constants.html.
	const rankedIDs = [4,6,42,410,420,440];
	return rankedIDs.includes(queue);
}

function getKeyFromId(champid) {
	for (var i=0;i<champIDs.length;i++) {
		if (champIDs[i].key == champid) {
			return champIDs[i].id;
		}
	}
	throw "Error getting key for: " + champid;
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
	while (await scrapeUsers(10) !== 0) {
		await scrapeAllGames();
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function start() {
	getCurrentPatch()
	.then(getChampionIDs)
	.then(startScraping)
	.then(() => console.log("Done scraping."))
	.catch(function(err) {
		console.log("Error on promise chain: " + err);
		console.log("Restarting...");
		start();
	});
}

MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;
	start();
});

