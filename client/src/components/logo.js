import React from 'react';
import {Link} from 'react-router-dom';
import Radium from 'radium';

const largeStyle = {
	"text-align": "center",
	display: "block",
	margin: "20px auto",
	width: 500,
	"font-size": 80,
	"@media (max-width: 540px)": {
		"font-size": 50,
		"width": "80%"
	}
};

const style = {
	display: "inline-block",
	"font-size": 40,
	"margin": "22px 0px",
	color: "white",
	"@media (max-width: 540px)": {
		"margin": "auto",
		"float": "none"
	}
};

const linkStyle = {
	"@media (max-width: 540px)": {
		display: "block",
		margin: "auto",
		"text-align": "center"
	}	
};

class Logo extends React.Component {

	render() {
		
		//Make React Router Link Radium-Aware
		const RadiumLink = Radium(Link);

		if (this.props.size === "large") {
			return (<h1 className="logo-large" style={largeStyle}>Jungle.ninja</h1>);
		} else {
			return (<RadiumLink style = {linkStyle} to="/"><h4 className="logo" style = {style}>Jungle.ninja</h4></RadiumLink>);
		}
	}

}

export default Radium(Logo);