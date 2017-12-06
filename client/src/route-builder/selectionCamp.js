import React from 'react';

const imageStyle = {
	width: "60%",
	height: "80%",
	margin: "6%",
	"border-radius": "20%"
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

			<div style={campStyle} onClick={ ()=>this.props.click(this.props.camp) }>
				<img style={imageStyle} src={this.props.camp.image}/>
			</div>

		)
	}

}

export default SelectionCamp;