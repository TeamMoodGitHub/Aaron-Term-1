import React from 'react';
import SelectionCamp from './selectionCamp';

import camps from './camps';

const divStyle = {
	margin: 10, 
	width: "30%", 
	height: 700,
	display: "inline-block",
	"min-width": 300
};

const blueStyle = {
	width: "33.333%", 
	height: 700, 
	"background-color": "#40C4FF",
	display: "inline-block"
};

const redStyle = {
	width: "33.333%", 
	height: 700, 
	"background-color": "#FF8A80",
	display: "inline-block"
};

const greenStyle = {
	width: "33.333%", 
	height: 700, 
	"background-color": "#b2ff59",
	display: "inline-block"
};

class RoutePicker extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={divStyle}> 
				<div style={blueStyle}>
					{camps[0].map((camp) => <SelectionCamp camp={camp} click={this.props.insertFunction}/>)}
				</div> 
				<div style={redStyle}>
					{camps[1].map((camp) => <SelectionCamp camp={camp} click={this.props.insertFunction}/>)}
				</div> 
				<div style={greenStyle}>
					{camps[2].map((camp) => <SelectionCamp camp={camp} click={this.props.insertFunction}/>)}
				</div> 
			</div>
		);
	}

}

export default RoutePicker;