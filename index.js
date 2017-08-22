const express = require('express');
const path = require('path');

const app = express();

//Serve static files from React app.
app.use(express.static(path.join(__dirname, 'client/build')));

//Serve static files from static folder.
app.use(express.static(path.join(__dirname, 'static')));

//Put all API endpoints under '/API'
app.get('/api', (req, res) => {
	res.json("Hello");
});

//Anything else will send back React's index.html file.

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on port ${port}`);