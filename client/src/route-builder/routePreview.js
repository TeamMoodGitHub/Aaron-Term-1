import React from 'react';

class RoutePreview extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{margin: 10, width: "30%", height: 600, "background-color": "blue", display: "inline-block"}}> 
				<div style={{width: "50%", height: 600, "background-color": "black", display: "inline-block"}} /> 
				<div style={{width: "50%", height: 600, "background-color": "grey", display: "inline-block"}} /> 
			</div>
		);
	}

}

export default RoutePreview;