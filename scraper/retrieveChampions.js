const cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');
const updateChampInfo = require('./updateChampInfo');

const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=false&api_key="+RIOT_API_KEY;

module.exports = function(db) {

	//Pull initially in case there are problems with the database. (Or database is wiped)
	retrieveChampions(db);

	//Currently, cron runs once per day at midnight.
	cron.schedule('0 0 * * *', retrieveChampions);
	//console.log("Retrieve Champions Cron Job Started.");
}

function retrieveChampions(db) {

	
		//console.log("Retrieving champions from API");
		https.get(url, function(res) {

			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					console.log("Could not retrieve champions from API. Status Code: " + res.statusCode);
					console.log("Contents of body: " + body);
					return;
				}

				//Otherwise, parse the data!
				var list = JSON.parse(body);

				if (db) {
					//For each champion, create an upsert request into Mongo.
					var request = [];
					for (var key in list.data) {
						request.push({
							updateOne: {
								filter: {
									key: key
								},
								update: {
									$set: list.data[key]
								},
								upsert: true
							}
						});

						//Also grab champion-specific info from champion-specific API.
						//updateChampInfo(list.data[key].id);
					}

					//Use the bulkWrite method from Mongo to handle the upsert requests.
					db.collection('champions').bulkWrite(request, function(err, results) {
						if (err) {
							console.log("Error inserting champions into Mongo: " + err);
							return;
						}
						console.log("Champion list updated. New Count: " + request.length);
					});
				} else {
					console.log("Database is null... Trying again later..");
				}
			});
		}).on('error', function(e) {
			console.log("Error pulling champions from Riot API: " + e);
		});
		//Then pull detailed champion info from API.
		updateChampInfo(db);

}