const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');

///Update this with patch date to parse games only from current patch.
const patchTime = new Date("September 14, 2017").getTime();
const patchPrefix = "7.18";

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

/**
* Gets the current patch from Riot's ddragon service.
* Not considered a call to Riot's API.
* used to pull most current champion logos.
*/
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

/**
* Used to retrieve the list of Champions and their IDs from Riot's ddragon service.
* This allows the API to retrieve data based on champion names rather than id numbers.
*/
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

/**
* Looks for the next unscraped game on Mongo and resolves with match ID.
*/
function scrapeNextGame() {
	return new Promise(function (resolve, reject) {
		const query = {
			scraped: false,
			patch: patchPrefix
		};
		const update = {
			$set: {
				scraped: true
			}
		};
		//Sort by last search time ascending.
		const options = null;

		db.collection('scraperGames' + patchPrefix).findOneAndUpdate(query, update, options, function(err, results) {
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

/**
* Looks for the next unscraped user from Mongo and returns with User ID.
*/
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

		db.collection('scraperUsers' + patchPrefix).findOneAndUpdate(query, update, options, function(err, results) {
			if (err) {
				reject("Error retrieving next user to scrape: " + err);
			} else {
				const oneMonth = 1000 * 60 * 60 * 24 * 30;
				//If last search is more recent than 30 days, return false.
				if (results.value.lastSearch > new Date().getTime() - oneMonth) {
					resolve(false);
					return;
				}
				resolve(results.value.userID);
			}
		});
	});
}

/**
* Adds user to scrape into Mongo.
*/
function insertUserToScrape(id) {
	db.collection('scraperUsers' + patchPrefix).findOneAndUpdate({
		userID: id
	}, {
		$setOnInsert: {
			lastSearch: -1
		}
	}, {
		upsert: true
	});
}

/**
* Adds match to scrape into Mongo.
*/
function insertMatchToScrape(id) {
	db.collection('scraperGames' + patchPrefix).findOneAndUpdate({
		matchID: id,
	}, {
		$setOnInsert: {
			scraped: false,
			patch: patchPrefix
		}
	}, {
		upsert: true
	});
}

/**
* Adds a victory for a jungler.
*/
function addJunglerWin(champid, platAndAbove=false) {
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			wins: 1,
			platWins: platAndAbove ? 1 : 0
		}
	}
	const options = {
		upsert: true
	}
	db.collection("junglerStats" + patchPrefix).updateOne(query, update, options);
}

/**
* Adds match for a jungler.
*/
function addJunglerGame(champid, platAndAbove=false){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			games: 1,
			platGames: platAndAbove ? 1 : 0
		}
	}
	const options = {
		upsert: true
	}
	db.collection("junglerStats" + patchPrefix).updateOne(query, update, options);
}

/**
* Adds match for a champion.
*/
function addChampionWin(champid, platAndAbove=false){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			wins: 1,
			platWins: platAndAbove ? 1 : 0
		}
	}
	const options = {
		upsert: true
	}
	db.collection("champStats" + patchPrefix).updateOne(query, update, options);
}

/**
* Adds match for a champion.
*/
function addChampionGame(champid, platAndAbove=false){
	const query = {
		champ: champid,
		key: getKeyFromId(champid)
	}
	const update = {
		$inc: {
			games: 1,
			platGames: platAndAbove ? 1 : 0
		}
	}
	const options = {
		upsert: true
	}
	db.collection("champStats" + patchPrefix).updateOne(query, update, options);
}

/**
* Pulls user's match history from Riot API.
* Adds all matches from match history into match list.
* Mongo will by default ignore any repeats added to match list.
*/
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

				if (!data.matches) {
					//Error value returned instead!
					reject("Data returned does not contain match history!");
					return;
				}

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

/**
* Pulls match data from Riot API.
* Also adds all players from match to player list.
* Mongo will by default ignore any repeats added to player list.
*/
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

				if (!data.participantIdentities) {
					//Error value returned instead!
					reject("Data returned does not contain match data!");
					return;
				}

				for (var i=0;i<data.participantIdentities.length;i++) {
					insertUserToScrape(data.participantIdentities[i].player.currentAccountId);
					//console.log("Added Account ID " + data.participantIdentities[i].player.currentAccountId + " to scrape.");
				}

				if (!data.gameVersion.startsWith(patchPrefix)) {
					console.log(data.gameVersion + " < " + patchPrefix + ". Skipping.");
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

/**
* Checks if a queue ID is for a ranked Summoner's Rift match.
*/
function isRanked(queue) {
	//IDs mapped from https://developer.riotgames.com/game-constants.html.
	const rankedIDs = [4,6,42,410,420,440];
	return rankedIDs.includes(queue);
}

/**
* Returns champion name from champion ID number.
*/
function getKeyFromId(champid) {
	for (var i=0;i<champIDs.length;i++) {
		if (champIDs[i].key == champid) {
			return champIDs[i].id;
		}
	}
	throw "Error getting key for: " + champid;
}

/**
* Scrape all unscraped games from game list.
*/
async function scrapeAllGames() {
	while (id = await scrapeNextGame()) {
		await parseGameByID(id);
		await sleep(delay);
	}
}

/**
* Scrape n unscraped users. If <n available, scrape until
* no unscraped users more are left.
*/
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

/**
* Called to start scraping users and matches.
*/
async function startScraping() {
	while (await scrapeUsers(10) !== 0) {
		await scrapeAllGames();
	}
}

/**
* Pause execution of code for a certain number of milliseconds.
* Used to keep within Riot's API rate limits.
*/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* Called upon execution to retrieve patch number, champion IDs, and start scraping.
* Also called again recursively after a 30 second delay if any error is thrown while scraping.
*/
function start() {
	getCurrentPatch()
	.then(getChampionIDs)
	.then(startScraping)
	.then(() => console.log("Done scraping."))
	.catch(function(err) {
		console.log("Error on promise chain: " + err);
		console.log("Restarting...");
		sleep(30000)
		.then(start);
	});
}

/**
* Connect to Mongo then start program execution.
*/
MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;
	start();
});

