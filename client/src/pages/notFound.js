import React from 'react';
import {Link} from 'react-router-dom';

const divStyle = {
	margin: "auto",
	position: "absolute",
	top: 0, left: 0, bottom: 0, right: 0,
	height: 500
};

const contentStyle = {
	"text-align": "center",
	display: "block",
	margin: "10px auto"
};

const NotFound = (props) => (
	<div className="notFound" style={divStyle}>
		<h1 style={contentStyle}> Unfortunately, we could not find the page you were looking for! :-(</h1>
		<h1 style={contentStyle}> But here's a cute picture of a dog! </h1>
		<img src="https://i.ytimg.com/vi/opKg3fyqWt4/hqdefault.jpg" alt="Cute Dog!" style={contentStyle}/>
		<Link to="/" style={contentStyle}><h3>Click here to go back to the home page.</h3></Link>
	</div>
	);

export default NotFound;