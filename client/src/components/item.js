import React from 'react';
import Radium from 'radium';

const imageURL = (version, id) => "http://ddragon.leagueoflegends.com/cdn/"+version+"/img/item/"+id+".png";
const divStyle = {
	display: "inline-block",
	padding: "0px 10px"
};

const pStyle = {
	"font-size": 16,
	"@media (max-width: 540px)": {
		"font-size": 12
	}
}


class Item extends React.Component {

	render() {
		if (this.props.button && this.props.version) {
			return <button onClick={this.props.onClick}><img src={imageURL(this.props.version, this.props.item.key)} alt={this.props.item.name} /><p>Item: {this.props.item.name}</p></button>;
		} else if (this.props.version) {
			return <div style={divStyle} className="item"><img src={imageURL(this.props.version, this.props.item.key)} alt={this.props.item.name} /><p style={pStyle}>{this.props.item.name}</p></div>;
		} else {
			return <p>Item: {this.props.item.name}</p>
		}
	}

}

export default Radium(Item);