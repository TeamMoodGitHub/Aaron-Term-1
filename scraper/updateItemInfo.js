const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');

const patchURL = "https://ddragon.leagueoflegends.com/api/versions.json";
const itemsURL = (patch) => "https://ddragon.leagueoflegends.com/cdn/"+patch+"/data/en_US/item.json";

module.exports = function(db) {

		https.get(patchURL, function(res) {

			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {


				//If response code isn't 2XX, there is a problem!
				if (res.statusCode < 200 || res.statusCode > 299) {
					console.log("Could not retrieve patch info. Status Code: " + res.statusCode);
					console.log("Contents of body: " + body);
					return;
				}

				//Otherwise, parse the data!
				var patches = JSON.parse(body);
				pullItems(patches[0], db);

			});
		}).on('error', function(e) {
			console.log("Error pulling patch version from Riot API: " + e);
		});
}

function pullItems(patch, db) {

	https.get(itemsURL(patch), function(res) {

		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {


			//If response code isn't 2XX, there is a problem!
			if (res.statusCode < 200 || res.statusCode > 299) {
				console.log("Could not retrieve item info. Status Code: " + res.statusCode);
				console.log("Contents of body: " + body);
				return;
			}

			//Otherwise, parse the data!
			var items = JSON.parse(body).data;
			var keys = Object.keys(items);
			if (db) {
				//For each champion, create an upsert request into Mongo.
				var request = [];
				for (var key in items) {
					request.push({
						updateOne: {
							filter: {
								key: key
							},
							update: {
								$set: items[key]
							},
							upsert: true
						}
					});

					//Also grab champion-specific info from champion-specific API.
					//updateChampInfo(list.data[key].id);
				}

				//Use the bulkWrite method from Mongo to handle the upsert requests.
				db.collection('items').bulkWrite(request, function(err, results) {
					if (err) {
						console.log("Error inserting item info into Mongo: " + err);
						return;
					} else {
						console.log("Updated database with " + keys.length + " items");
					}
				});
			} else {
				console.log("Database is null... Trying again later..");
			}

		});
	}).on('error', function(e) {
		console.log("Error pulling patch version from Riot API: " + e);
	});


					
}