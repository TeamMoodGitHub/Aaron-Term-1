import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = (props) => (
	<div className="notFound">
		<h1> Unfortunately, we could not find the page you were looking for! :-(</h1>
		<h1> But here's a cute picture of a dog! </h1>
		<img src="https://i.ytimg.com/vi/opKg3fyqWt4/hqdefault.jpg" alt="Cute Dog!"/>
		<Link to="/"><h3>Click here to go back to the home page.</h3></Link>
	</div>
	);

export default NotFound;