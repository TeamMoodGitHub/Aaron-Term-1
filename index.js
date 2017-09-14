const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const MONGO_LINK = process.env.MONGO_LINK || require('./config').MONGO_LINK;
const CURRENT_PATCH = process.env.CURRENT_PATCH || require('./config').CURRENT_PATCH;
const retrieveChampionsHourly = require('./scraper/retrieveChampions');

const app = express();

var db;

//Serve static files from React app.
app.use(express.static(path.join(__dirname, 'client/build')));

//Serve static files from static folder.
app.use(express.static(path.join(__dirname, 'static')));

//Put all API endpoints under '/API'
/**
* Called when webapp requests list of champions for the search bar.
* Returns a list of champions and their titles.
*/
app.get('/api/champions', (req, res) => {
	db.collection("champions").find().toArray(function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for champions!",
				error: err
			});
			return;
		}
		res.json(results);
	});
});

/**
* Called when webapp requests win rate for specific champion in current patch.
* Returns JSON object containing win rate and number of games scraped.
*/
app.get('/api/champion/:champ/wr', (req, res) => {
	db.collection("champStats" + CURRENT_PATCH).findOne({key: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for win rate!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Champion not found!", found:-1} : results);
	});
});

/**
* Called when webapp requests win rate for specific jungler in current patch.
* Returns JSON object containing win rate and number of games scraped.
*/
app.get('/api/jungler/:champ/wr', (req, res) => {
	db.collection("junglerStats" + CURRENT_PATCH).findOne({key: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for win rate!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Champion not found!", found:-1} : results);
	});
});

/**
* Called when webapp requests jungle routes for specific jungler 
* and side. Returns array of jungle routes.
*/
app.get('/api/jungler/:champ/jungleRoutes/:side', (req, res) => {
	const testReturnValue = 
			[
				{
					id: 1,
					path: [1,2,3,4,5],
					score: 1
				},
				{
					id: 2,
					path: [2,3,4,5,6],
					score: 2
				},
				{
					id: 3,
					path: [3,4,5,6,7],
					score: 3
				},
				{
					id: 4,
					path: [4,6,1,2,1],
					score: 4
				}
			];
	
	res.json(testReturnValue);
});

/**
* Called when webapp requests starting items for specific jungler.
* Returns array of starting Items.
*/
app.get('/api/jungler/:champ/startingItems', (req, res) => {
	const testReturnValue = 
			[
				{
					id: 1,
					items: [123,234,345,456],
					score: 25
				},
				{
					id: 2,
					items: [4,7,1,2],
					score: 10
				}
			];
	
	res.json(testReturnValue);
});

///Called when a user attempts to upvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/champion/:champ/jungleRoutes/:side/inc/:id', (req, res) => {
	//req.params.champ
	//req.params.side
	//req.params.id
});

///Called when a user attempts to downvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/champion/:champ/jungleRoutes/:side/dec/:id', (req, res) => {
	//req.params.champ
	//req.params.side
	//req.params.id
});

app.get('/api/champion/:champ', (req, res) => {
	db.collection("champ").findOne({key: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for champions!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Champion not found!", found: -1} : results);
	});
});

/*
* Handles root API route and returns an error object.
*/
app.get('/api', (req, res) => {

	res.status(400).json({
		error: "Invalid Request"
	});

});

///Any other GET requests will be handled by React.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

///process.env.PORT is set when running on heroku.
const port = process.env.PORT || 5000;

//The database credentials are hidden for security purposes. 
//When hosting locally, it is stored in a local configuration file, 
//and when hosting on Heroku, it is stored as an environment variable.
MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});

	retrieveChampionsHourly(db);
});
