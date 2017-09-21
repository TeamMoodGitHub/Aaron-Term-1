import React from 'react';

class Item extends React.Component {

	render() {
		if (this.props.button) {
			return <button onClick={this.props.onClick}><p>Item: {this.props.item.name}</p></button>;
		} else {
			return <p>Item: {this.props.item.name}</p>;
		}
	}

}

export default Item;