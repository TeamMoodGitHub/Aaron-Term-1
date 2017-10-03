var http = require("http");

console.log("Will start pinging in 5 minutes.");

setInterval(function() {
   	console.log("Pinging.");
	http.get("http://jungle-gg.herokuapp.com");
}, 300000); // every 5 minutes (300000)
