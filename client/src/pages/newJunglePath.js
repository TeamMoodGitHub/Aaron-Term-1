import React from 'react';

class NewJunglePath extends React.Component {

	render() {
		return <h1>Create a new Jungle Path for: {this.props.match.params.championName}</h1>
	}

}

export default NewJunglePath;