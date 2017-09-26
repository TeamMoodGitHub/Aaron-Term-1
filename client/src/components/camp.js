import React from 'react';

import dragon from '../images/dragon.png';
import baron from '../images/baron.png';
import red from '../images/red.png';
import blue from '../images/blue.png';
import gromp from '../images/gromp.png';
import wolves from '../images/wolves.png';
import raptors from '../images/raptors.png';
import krugs from '../images/krugs.png';
import blueSide from '../images/blueSide.png';
import redSide from '../images/redSide.png';
import swords from '../images/swords.png';
import arrowRight from '../images/arrowRight.png';

const divStyle = {
	width: 100,
	display: "inline-block"
}

const h2Style = {
	"font-size": 23,
	display: "inline-block"
};

const imgStyle = {
	"max-width": 100,
	"max-height": 125,
	width: "auto",
	height: "auto",
	display: "inline-block"
};

class Camp extends React.Component {

	render() {
		var itemSrc;
		var itemLabel;
		if (this.props.camp === "1") {
			itemSrc = swords;
			itemLabel = "Gank Top";
		} else if (this.props.camp === "2") {
			itemSrc = swords;
			itemLabel = "Gank Mid";
		} else if (this.props.camp === "3") {
			itemSrc = swords;
			itemLabel = "Gank Bot";
		} else if (this.props.camp === "5") {
			itemSrc = dragon;
			itemLabel = "Dragon";
		} else if (this.props.camp === "6") {
			itemSrc = baron;
			itemLabel = "Baron";
		} else if (this.props.camp === "10") {
			itemSrc = blueSide;
			itemLabel = "Blue Base";
		} else if (this.props.camp === "20") {
			itemSrc = redSide;
			itemLabel = "Red Base";
		} else {
			if (this.props.camp.startsWith("1")) {
				itemLabel = "Blue ";
			} else {
				itemLabel = "Red ";
			}

			if (this.props.camp.endsWith("1")) {
				itemSrc = gromp;
				itemLabel += "Gromp";
			} else if (this.props.camp.endsWith("2")) {
				itemSrc = wolves;
				itemLabel += "Wolves";
			} else if (this.props.camp.endsWith("3")) {
				itemSrc = blue;
				itemLabel += "Side Blue Buff";
			} else if (this.props.camp.endsWith("4")) {
				itemSrc = raptors;
				itemLabel += "Raptors";
			} else if (this.props.camp.endsWith("5")) {
				itemSrc = red;
				itemLabel += "Side Red Buff";
			} else if (this.props.camp.endsWith("6")) {
				itemSrc = krugs;
				itemLabel += "Krugs";
			}
		}
		if (this.props.drawArrow) {
			return (
				<div style={{display: "inline-block"}}>
					<div  style={divStyle} className = "camp">
						<img style={imgStyle} className="camp" src={arrowRight} alt="Right Arrow" />
					</div>
					<div  style={divStyle} className = "camp">
						<img style={imgStyle} className="camp" src={itemSrc} alt={itemLabel} />
						<h2 style={h2Style} className="campLabel">{itemLabel}</h2>
					</div>
				</div>
			);
		} else {
			return (
				<div  style={divStyle} className = "camp">
					<img style={imgStyle} className="camp" src={itemSrc} alt={itemLabel} />
					<h2 style={h2Style} className="campLabel">{itemLabel}</h2>
				</div>
			);
		}
	}

}

export default Camp;