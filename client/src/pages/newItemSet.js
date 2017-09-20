import React from 'react';

import Item from '../components/item';

class NewItemSet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: null
		}

		this.getItems = this.getItems.bind(this);

		this.getItems();
	}

	getItems() {
		fetch('/api/items')
		.then((res) => res.json())
		.then((items) => this.setState({items}));
	}

	render() {
		if (!this.state.items) {
			return (
				<div id="itemSetCreator">
					<h1>Create a new Item Set for: {this.props.match.params.championName}</h1>
					<h1>Loading Items...</h1>
				</div>
			);
		} else {
			return (
				<div id="itemSetCreator">
					<h1>Create a new Item Set for: {this.props.match.params.championName}</h1>
					{this.state.items.map(item => <Item button={true} item={item} />)}
				</div>
			);
		}
		
	}

}

export default NewItemSet;