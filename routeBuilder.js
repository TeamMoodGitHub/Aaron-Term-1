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
		if (i > 0) {
			lenna = await drawArrow(lenna, route[i-1], route[i]);
		}
	}


	return lenna;
}

async function addCamp(lenna, camp, position) {

	const image = await (camp.smite ? Jimp.read("circleNums/smite.png") : Jimp.read("circleNums/" + (position+1) + ".png"));
	return lenna.composite(image, camp.x, camp.y);
}

async function drawArrow(lenna, camp1, camp2) {

	const deltaX = camp2.x - camp1.x;
	const deltaY = camp2.y - camp1.y;

	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) - 70;

	const image = await Jimp.read("arrows/" + (Math.floor(distance / 100) + 1) + "00.png");

	const angle = (deltaX > 0 ? Math.atan(deltaY / deltaX) : -Math.PI + Math.atan(deltaY / deltaX)) * 180 / Math.PI;

	const resizedImage = await image.resize(distance, 25);
	const arrow = await resizedImage.rotate(angle);

	const adjX = 35 + Math.abs(35 * Math.cos(angle * Math.PI / 180));
	const adjY = 35 + Math.abs(35 * Math.sin(angle * Math.PI / 180));

	if (angle >= -270 && angle < -180) {
		return lenna.composite(arrow, camp2.x + adjX, camp1.y + adjY);
	} else if (angle >= -180 && angle < -90) {
		return lenna.composite(arrow, camp2.x + adjX, camp2.y + adjY);
	} else if (angle >= -90 && angle < 0) {
		return lenna.composite(arrow, camp1.x + adjX, camp2.y + adjY);
	} else {
		return lenna.composite(arrow, camp1.x + adjX, camp1.y + adjY);
	}

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