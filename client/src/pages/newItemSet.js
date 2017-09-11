import React from 'react';

class NewItemSet extends React.Component {

	render() {
		return <h1>Create a new Item Set for: {this.props.match.params.championName}</h1>
	}

}

export default NewItemSet;