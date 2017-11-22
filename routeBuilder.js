module.exports = {

	generateRoute: function(req, res) {
		console.log(req.params.route);
		var route = [];
		for (var i = 0 ; i < req.params.route.length ; i+= 2) {
			var current = req.params.route.substring(i, i+2);
			const camp = getCamp(current);
			if (camp === null) {
				//Error res.send("error") and return
			}
			route.concat(camp);
		}
		sendRoute(route);
		return true;
	}
}

function sendRoute(route) {
	Jimp.read("client/src/images/riftMap.png", function (err, lenna) {
	    if (err) throw err;
	    lenna.resize(256, 256)            // resize 
	        .quality(60)                 // set JPEG quality 
	        .greyscale()                 // set greyscale 
	        .getBuffer(Jimp.MIME_JPEG, function(err, buffer){
         		res.set("Content-Type", Jimp.MIME_JPEG);
         		res.send(buffer);
         	}); // save 
	});
}

function getCamp(campString) {
	if (current.length !== 2) {
		return null;
	}
	return null;
}