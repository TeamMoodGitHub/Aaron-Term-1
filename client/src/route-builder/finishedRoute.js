import React from 'react';

class FinishedRoute extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <h1>Finished Route: {JSON.stringify(this.props.route)}</h1>;
	}
}

export default FinishedRoute;