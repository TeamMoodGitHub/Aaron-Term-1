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

async function sendRoute(res, route) {
	var lenna = await Jimp.read("client/src/images/riftMap.png");
    var finalizedImage = await addRoute(lenna, route);
    finalizedImage.getBuffer(Jimp.MIME_JPEG, function(err, buffer){
 		res.set("Content-Type", Jimp.MIME_JPEG);
 		res.send(buffer);
 	}); // save 
}

async function addRoute(lenna, route) {

	for (var i = 0 ; i < route.length ; i++) {
		//console.log("Adding " + route[i].name + (route[i].smite ? " with smite" : "") +" to image.");
		lenna = await addCamp(lenna, route[i], i);
	}


	return lenna;
}

async function addCamp(lenna, camp, position) {

	const image = await (camp.smite ? Jimp.read("circleNums/smite.png") : Jimp.read("circleNums/" + (position+1) + ".png"));
	return lenna.composite(image, camp.x, camp.y);
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