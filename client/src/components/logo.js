import React from 'react';
import {Link} from 'react-router-dom';

const largeStyle = {
	"text-align": "center",
	display: "block",
	margin: "20px auto",
	width: 500,
	"font-size": 80
};

const style = {
	display: "inline-block",
	"font-size": 40,
	"margin": "22px 0px"
}

const logo = (props) => (props.size === "large") ? 
(<h1 className="logo-large" style={largeStyle}>Jungle.GG</h1>)
:
(<Link to="/"><h4 className="logo" style = {style}>Jungle.GG</h4></Link>);

export default logo;