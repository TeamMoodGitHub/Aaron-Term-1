import React from 'react';

const imageURL = (version, id) => "http://ddragon.leagueoflegends.com/cdn/"+version+"/img/item/"+id+".png";

class Item extends React.Component {

	render() {
		if (this.props.button && this.props.version) {
			return <button onClick={this.props.onClick}><img src={imageURL(this.props.version, this.props.item.key)} alt={this.props.item.name} /><p>Item: {this.props.item.name}</p></button>;
		} else {
			return <p>Item: {this.props.item.name}</p>;
		}
	}

}

export default Item;