import React from 'react';

import RoutePicker from '../route-builder/routePicker';
import RoutePreview from '../route-builder/routePreview';
import FinishedRoute from '../route-builder/finishedRoute';

import camps from '../route-builder/camps';

const pageStyle = {
	"font-family": "AppleGothic",
	"text-align": "center"
};

const submitStyle = {
	"font-size": "2em",
	"border-width": 2,
	"border-radius": 15
}

class RouteBuilder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			route: [camps[0][0], camps[1][0], camps[2][0]]
		}
	}

	addToRoute(camp) {
		this.setState({route: this.state.route.concat(camp)});
	}

	clearRoute() {
		this.setState({route: []})
	}

	render() {
		return (
			<div style={pageStyle}>
				<h1>Jungle.Ninja Route Builder</h1>
				<section>
					<RoutePicker insertFunction={this.addToRoute}/>
					<RoutePreview route={this.state.route}/>
				</section>
				<section>
					<input style={submitStyle} type="submit" value="Create Route" />
				</section>
				<FinishedRoute route={this.state.route} />
			</div>
		);
	}

}

export default RouteBuilder;