import React from 'react';

class FinishedRoute extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h1>Finished Route: { JSON.stringify(this.props.routeImage) }</h1>
				{ 
					this.props.routeImage ? 
					(<img src={this.props.routeImage} />) 
					: 
					<img /> 
				}
			</div>
		);
	}
}

export default FinishedRoute;