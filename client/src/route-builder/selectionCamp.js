import React from 'react';

const paragraphStyle = {
	margin: 0,
	"vertical-align": "middle",
	"line-height": 100
};

const campStyle = {
	height: 100,
	width: "100%"
};

class SelectionCamp extends React.Component {

	constructor(props){
		super(props);
	}

	render() {
		return (

			<div style={campStyle}>
				<p style={paragraphStyle}>{this.props.camp.code}</p>
			</div>

		)
	}

}

export default SelectionCamp;