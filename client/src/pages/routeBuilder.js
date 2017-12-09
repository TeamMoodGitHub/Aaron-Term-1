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
			route: [],
			smite: []
		}

		this.addToRoute = this.addToRoute.bind(this);
		this.clearRoute = this.clearRoute.bind(this);
	}

	addToRoute(camp) {

		if (this.state.route.length == 0 || this.state.route[this.state.route.length - 1] != camp) {
			this.setState({
				route: this.state.route.concat(camp),
				smite: this.state.smite.concat(false)
			});
		} else {
			var currentSmite = this.state.smite;
			currentSmite[currentSmite.length - 1] = !currentSmite[currentSmite.length - 1];
			this.setState({smite: currentSmite});
		}
		
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
					<RoutePreview route={this.state.route} smites={this.state.smite}/>
				</section>
				<section>
					<button style={submitStyle} onClick={this.clearRoute}>Clear Route</button>
					<input style={submitStyle} type="submit" value="Create Route" />
				</section>
				<FinishedRoute route={this.state.route} />
			</div>
		);
	}

}

export default RouteBuilder;