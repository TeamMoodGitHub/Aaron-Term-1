import React from 'react';

class RoutePicker extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{margin: 10, width: "30%", height: 600, "background-color": "red", display: "inline-block"}}> 
				<div style={{width: "33.333%", height: 600, "background-color": "orange", display: "inline-block"}} /> 
				<div style={{width: "33.333%", height: 600, "background-color": "green", display: "inline-block"}} /> 
				<div style={{width: "33.333%", height: 600, "background-color": "purple", display: "inline-block"}} /> 
			</div>
		);
	}

}

export default RoutePicker;