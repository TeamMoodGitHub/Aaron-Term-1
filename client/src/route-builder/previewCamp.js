import React from 'react';

import Gromp from './icons/gromp.png';

const campStyle = {
	width: "100%", 
	height: 140, 
	"background-color": "red", 
	display: "inline-block"
};

const numberStyle = {
	width: "28%",
	height: "100%",
	"background-color": "orange",
	display: "inline-block",
	"vertical-align": "top"
};

const photoStyle = {
	width: "28%",
	height: "100%",
	"background-color": "green",
	display: "inline-block",
	"vertical-align": "top"
};

const nameStyle = {
	width: "44%",
	height: "100%",
	"background-color": "blue",
	display: "inline-block",
	"vertical-align": "top"
};

const numberItemStyle = {
	"text-align": "center",
	position: "relative",
	top: "50%",
	left: "50%",
	"transform": "translateY(-50%) translateX(-50%)",
	margin: 0,
	border: "2px solid",
	width: 44,
	"font-size": 30,
	"border-radius": "100%",
	"padding-top": 6,
	"background-color": "white"
};

const nameItemStyle = {
	"text-align": "center",
	position: "relative",
	top: "50%",
	transform: "translateY(-50%)",
	margin: 0,
	"font-size": 30
};

const photoItemStyle = {
	position: "relative",
	top: "50%",
	transform: "translateY(-50%)",
	height: "70%",
	"border-radius": 20
};

class PreviewCamp extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		//Number, Picture, Name
		return (

			<div style={campStyle}>
				<div style={numberStyle}>
					<p style={numberItemStyle}>{this.props.number}</p>
				</div> 
				<div style={photoStyle}>
					<img style={photoItemStyle} src={Gromp} />
				</div> 
				<div style={nameStyle}>
					<p style={nameItemStyle}>{this.props.camp}</p>
				</div> 

			</div>

		)
	}

}

export default PreviewCamp;