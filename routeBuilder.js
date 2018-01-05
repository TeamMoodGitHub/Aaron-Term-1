const Jimp = require("jimp");
const camps = require("./camps");

module.exports = {

	generateRoute: function(req, res) {
		//console.log(req.params.route);
		var route = [];
		const codes = req.params.route.split(",");
		for (var i = 0 ; i < codes.length ; i++) {
			const camp = getCamp(codes[i]);
			if (camp === null) {
				res.send("Error - Unknown Code: " + codes[i]);
				return;
			}
			route = route.concat(camp);
		}

		sendRoute(res, route);
		return true;
	}
};

function sendRoute(res, route) {
	Jimp.read("client/src/images/riftMap.png", function (err, lenna) {
	    if (err) throw err;
	    addRoute(lenna, route)
	        .getBuffer(Jimp.MIME_JPEG, function(err, buffer){
         		res.set("Content-Type", Jimp.MIME_JPEG);
         		res.send(buffer);
         	}); // save 
	});
}

function addRoute(lenna, route) {

	for (var i = 0 ; i < route.length ; i++) {
		//console.log("Adding " + route[i].name + (route[i].smite ? " with smite" : "") +" to image.");
		lenna = addCamp(lenna, route[i], i);
	}


	return lenna;
}


function addCamp(lenna, camp, position, smite) {
	return lenna;
}

function getCamp(campString) {
	for (var i = 0 ; i < camps.length ; i++) {
		for (var j = 0; j < camps[i].length ; j++) {
			if (campString.startsWith(camps[i][j].code)) {

				//Clone Object.
				var ret = Object.assign({}, camps[i][j]);

				if (campString[2] === "S") {
					ret.smite = true;
				}

				return ret;
			}
		}
	}
	return null;
}