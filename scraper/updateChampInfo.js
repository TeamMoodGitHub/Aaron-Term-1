const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');

module.exports = function(db) {
	const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=all&dataById=false&api_key="+RIOT_API_KEY;

		//console.log("Retrieving champions from API");
		https.get(url, function(res) {

			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					console.log("Could not retrieve detailed champion info from API. Status Code: " + res.statusCode);
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
					db.collection('champ').bulkWrite(request, function(err, results) {
						if (err) {
							console.log("Error inserting detailed champion info into Mongo: " + err);
							return;
						}
					});
				} else {
					console.log("Database is null... Trying again later..");
				}
			});
		}).on('error', function(e) {
			console.log("Error pulling detailed champion info from Riot API: " + e);
		});
}
