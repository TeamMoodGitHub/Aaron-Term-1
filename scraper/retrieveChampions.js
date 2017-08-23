const cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('../config').MONGO_LINK;
const RIOT_API_KEY = process.env.RIOT_API_KEY || require('../config').RIOT_API_KEY;
const https = require('https');

var db;
const url = "https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=false&api_key="+RIOT_API_KEY;

MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log("Error Connecting to Mongo to update Champions: " + err);
		return;
	}
	db = database;
});

module.exports = function() {
	//console.log("Retrieve Champions Cron Job Started.");
	
	//In the future, update this to once per day.
	//Currently, cron runs once per hour.
	cron.schedule('0 * * * *', function() {
	
		console.log("Retrieving champions from API");
		https.get(url, function(res) {
			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				var list = JSON.parse(body);
				if (db) {
					db.collection('champions').insertMany(Object.values(list.data), function(err, results) {
						if (err) {
							console.log("Error inserting champions into Mongo: " + err);
							return;
						}
						console.log("Champion list updated. New Count: " + list.data.length);
					});
				} else {
					console.log("Database is null... Trying again later..");
				}
			});
		}).on('error', function(e) {
			console.log("Error pulling champions from Riot API: " + e);
		});

});
}
