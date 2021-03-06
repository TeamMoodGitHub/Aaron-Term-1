const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const MONGO_LINK = process.env.MONGO_LINK || require('./config').MONGO_LINK;
const CURRENT_PATCH = process.env.CURRENT_PATCH || require('./config').CURRENT_PATCH;
const retrieveChampionsDaily = require('./scraper/retrieveChampions');
const bodyParser = require('body-parser');

const routeBuilder = require("./routeBuilder");

const app = express();

//Number of Routes per page.
const countPerPage = 5;

var db;

//Serve static files from React app.
app.use(express.static(path.join(__dirname, 'client/build')));

//Serve static files from static folder.
app.use(express.static(path.join(__dirname, 'static')));

//Add Body Parser to parse POST request data.
app.use(bodyParser.urlencoded({extended: false}));
//Parse JSON Format for POST body data.
app.use(bodyParser.json());


app.get('/api/buildRoute/:route', (req, res) => {

	routeBuilder.generateRoute(req, res);

});


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
* Called when webapp requests jungle routes for specific jungler. 
* Returns array of jungle routes.
*/
app.get('/api/jungler/:champ/jungleRoutes/:page', (req, res) => {
	db.collection("jungleRoutes" + CURRENT_PATCH).find({champ: req.params.champ}).sort({score: -1}).skip(countPerPage * req.params.page).limit(countPerPage).toArray(function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for Jungle Routes!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Routes not found!", found: -1} : results);
	});
});

/**
* Called when webapp requests starting items for specific jungler.
* Returns array of starting Items.
*/
app.get('/api/jungler/:champ/itemSets/:page', (req, res) => {
	db.collection("itemSets" + CURRENT_PATCH).find({champ: req.params.champ}).sort({score: -1}).skip(countPerPage * req.params.page).limit(countPerPage).toArray(function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for Item Sets!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Sets not found!", found: -1} : results);
	});
});

///Called when a user attempts to upvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/jungler/:champ/jungleRoute/inc/:id', (req, res) => {
	db.collection("jungleRoutes" + CURRENT_PATCH).findOne({"_id": new ObjectId(req.params.id), champ: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error checking if already voted!",
				error: err
			});
			return;
		}

		const upvoted = results.upvoters && results.upvoters.includes(req.connection.remoteAddress);
		const downvoted = results.downvoters && results.downvoters.includes(req.connection.remoteAddress);

		var action;
		if (!upvoted && !downvoted) {
			action = 
			{
				$inc: {
					up: 1,
					score: 1
				},
				$push: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (upvoted) {
			action = 
			{
				$inc: {
					up: -1,
					score: -1
				},
				$pull: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (downvoted) {
			action = 
			{
				$inc: {
					up: 1,
					down: -1,
					score: 2
				},
				$push: {
					upvoters: req.connection.remoteAddress
				},
				$pull: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else {
			res.json({success: -1, message: "Internal Error! It looks like you've voted multiple times on this route!"});
			return;
		}

		db.collection("jungleRoutes" + CURRENT_PATCH).updateOne({
				"_id": new ObjectId(req.params.id),
				champ: req.params.champ
			}, action, function(err, results) {
				if (err) {
					res.status(500).json({
						source: "Error incrementing jungle route " + req.params.id + "!",
						error: err
					});
				} else {
					res.json({success: 1, results});
				}
		});
	});
});

///Called when a user attempts to downvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/jungler/:champ/jungleRoute/dec/:id', (req, res) => {
	db.collection("jungleRoutes" + CURRENT_PATCH).findOne({"_id": new ObjectId(req.params.id), champ: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error checking if already voted!",
				error: err
			});
			return;
		}

		const upvoted = results.upvoters && results.upvoters.includes(req.connection.remoteAddress);
		const downvoted = results.downvoters && results.downvoters.includes(req.connection.remoteAddress);

		var action;
		if (!upvoted && !downvoted) {
			action = 
			{
				$inc: {
					down: 1,
					score: -1
				},
				$push: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else if (upvoted) {
			action = 
			{
				$inc: {
					up: -1,
					down: 1,
					score: -2
				},
				$push: {
					downvoters: req.connection.remoteAddress
				},
				$pull: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (downvoted) {
			action = 
			{
				$inc: {
					down: -1,
					score: 1
				},
				$pull: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else {
			res.json({success: -1, message: "Internal Error! It looks like you've voted multiple times on this route!"});
			return;
		}

		db.collection("jungleRoutes" + CURRENT_PATCH).updateOne({
				"_id": new ObjectId(req.params.id),
				champ: req.params.champ
			}, action, function(err, results) {
				if (err) {
					res.status(500).json({
						source: "Error decrementing jungle route " + req.params.id + "!",
						error: err
					});
				} else {
					res.json({success: 1, results});
				}
		});
	});
});

///Called when a user attempts to upvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/jungler/:champ/itemSet/inc/:id', (req, res) => {
	db.collection("itemSets" + CURRENT_PATCH).findOne({"_id": new ObjectId(req.params.id), champ: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error checking if already voted!",
				error: err
			});
			return;
		}

		const upvoted = results.upvoters && results.upvoters.includes(req.connection.remoteAddress);
		const downvoted = results.downvoters && results.downvoters.includes(req.connection.remoteAddress);

		var action;
		if (!upvoted && !downvoted) {
			action = 
			{
				$inc: {
					up: 1,
					score: 1
				},
				$push: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (upvoted) {
			action = 
			{
				$inc: {
					up: -1,
					score: -1
				},
				$pull: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (downvoted) {
			action = 
			{
				$inc: {
					up: 1,
					down: -1,
					score: 2
				},
				$push: {
					upvoters: req.connection.remoteAddress
				},
				$pull: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else {
			res.json({success: -1, message: "Internal Error! It looks like you've voted multiple times on this item set!"});
			return;
		}

		db.collection("itemSets" + CURRENT_PATCH).updateOne({
				"_id": new ObjectId(req.params.id),
				champ: req.params.champ
			}, action, function(err, results) {
				if (err) {
					res.status(500).json({
						source: "Error incrementing item set " + req.params.id + "!",
						error: err
					});
				} else {
					res.json({success: 1, results});
				}
		});
	});
});

///Called when a user attempts to downvote a jungle route.
///Will return with success/fail as JSON Object.
///Will also ensure user hasn't already voted before.
app.post('/api/jungler/:champ/itemSet/dec/:id', (req, res) => {
	db.collection("itemSets" + CURRENT_PATCH).findOne({"_id": new ObjectId(req.params.id), champ: req.params.champ}, function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error checking if already voted!",
				error: err
			});
			return;
		}

		const upvoted = results.upvoters && results.upvoters.includes(req.connection.remoteAddress);
		const downvoted = results.downvoters && results.downvoters.includes(req.connection.remoteAddress);

		var action;
		if (!upvoted && !downvoted) {
			action = 
			{
				$inc: {
					down: 1,
					score: -1
				},
				$push: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else if (upvoted) {
			action = 
			{
				$inc: {
					up: -1,
					down: 1,
					score: -2
				},
				$push: {
					downvoters: req.connection.remoteAddress
				},
				$pull: {
					upvoters: req.connection.remoteAddress
				}
			};
		} else if (downvoted) {
			action = 
			{
				$inc: {
					down: -1,
					score: 1
				},
				$pull: {
					downvoters: req.connection.remoteAddress
				}
			};
		} else {
			res.json({success: -1, message: "Internal Error! It looks like you've voted multiple times on this item set!"});
			return;
		}

		db.collection("itemSets" + CURRENT_PATCH).updateOne({
				"_id": new ObjectId(req.params.id),
				champ: req.params.champ
			}, action, function(err, results) {
				if (err) {
					res.status(500).json({
						source: "Error decrementing item set " + req.params.id + "!",
						error: err
					});
				} else {
					res.json({success: 1, results});
				}
		});
	});
});


///Called when a user attempts to submit a jungle route.
///Will return with success/fail as JSON Object.
app.post('/api/jungler/:champ/jungleRoute', (req, res) => {
	db.collection("jungleRoutes" + CURRENT_PATCH).findOneAndUpdate({
		champ: req.params.champ,
		route: req.body
	}, {
		$setOnInsert: {
			up: 0,
			down: 0,
			score: 0
		}
	}, {
		upsert: true
	}, function(err, results) {
		if (err) {
			res.status(500).json({
				source: "Error adding Jungle Route!",
				error: err
			});
		} else {
			res.json({success: 1, results});
		}
	});
	//req.params.champ
});

///Called when a user attempts to submit an item set.
///Will return with success/fail as JSON Object.
app.post('/api/jungler/:champ/itemSet', (req, res) => {
	db.collection("itemSets" + CURRENT_PATCH).findOneAndUpdate({
		champ: req.params.champ,
		set: req.body
	}, {
		$setOnInsert: {
			up: 0,
			down: 0,
			score: 0
		}
	}, {
		upsert: true
	}, function(err, results) {
		if (err) {
			res.status(500).json({
				source: "Error adding Item Set!",
				error: err
			});
		} else {
			res.json({success: 1, results});
		}
	});
	//req.params.champ
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

app.get('/api/items', (req, res) => {
	db.collection("items").find().toArray(function(err, results) {
		if (err) {
			//Send Error Code 500 - Internal Server Error if query fails.
			res.status(500).json({
				source: "Error querying database for items!",
				error: err
			});
			return;
		}
		res.json(results === null ? {source: "Items not found!", found: -1} : results);
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

console.log("Waiting for Connection to Mongo...");

//The database credentials are hidden for security purposes. 
//When hosting locally, it is stored in a local configuration file, 
//and when hosting on Heroku, it is stored as an environment variable.
MongoClient.connect(MONGO_LINK, (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;
	console.log("Connected to Mongo.");
	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});

	retrieveChampionsDaily(db);
});
