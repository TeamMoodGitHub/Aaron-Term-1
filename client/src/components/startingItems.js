import React from 'react';

class StartingItems extends React.Component {

	render() {
		return <h1>Starting Items for: {this.props.champ || "Loading..."}</h1>;
	}

}

export default StartingItems;