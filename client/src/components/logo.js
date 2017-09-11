import React from 'react';

const largeStyle = {
	"text-align": "center",
	display: "block",
	margin: "20px auto",
	width: 500,
	"font-size": 80
};

const logo = (props) => (props.size === "large") ? 
(<h1 className="logo-large" style={largeStyle}>Jungle.GG</h1>)
:
(<h4 className="logo">Jungle.GG</h4>);

export default logo;