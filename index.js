const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const app = express();

var db;

//Serve static files from React app.
app.use(express.static(path.join(__dirname, 'client/build')));

//Serve static files from static folder.
app.use(express.static(path.join(__dirname, 'static')));

//Put all API endpoints under '/API'
app.get('/api', (req, res) => {
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

//Anything else will send back React's index.html file.

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;

//The database credentials are hidden for security purposes. 
//When hosting locally, they are stored in a local configuration file, 
//and when hosting on Heroku, it is stored as an environment variable.
MongoClient.connect(process.env.MONGO_LINK || require("./config/mongoLink"), (err, database) => {
	if (err) {
		console.log(err);
		return;
	}
	db = database;

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
})
