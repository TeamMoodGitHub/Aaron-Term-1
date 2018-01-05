import React from 'react';

import RoutePicker from '../route-builder/routePicker';
import RoutePreview from '../route-builder/routePreview';
import FinishedRoute from '../route-builder/finishedRoute';

import camps from '../route-builder/camps';

const pageStyle = {
	"font-family": "Roboto",
	"text-align": "center"
};

const submitStyle = {
    "background-color": "#b2ff59",
	"border-color": "#fff",
	"border-radius": 2,
	"font-size": "0.875rem",
	"font-weight": "500",
	"letter-spacing": "0.04em",
	"line-height": "2.25rem",
	"text-decoration": "none",
	"text-transform": "uppercase",
	"color": "black",
	"cursor": "pointer",
	"box-sizing": "border-box",
	"min-width": "64px",
	"height": "36px",
	"padding": "0 16px",
	"border": "none",
	"outline": "none",
	"text-align": "center",
	margin: "20px"
};

class RouteBuilder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			route: [],
			smite: [],
			routeImage: null
		}

		this.addToRoute = this.addToRoute.bind(this);
		this.clearRoute = this.clearRoute.bind(this);
		this.createRoute = this.createRoute.bind(this);
		this.routeToAPIString = this.routeToAPIString.bind(this);
		this.deleteAtPosition = this.deleteAtPosition.bind(this);
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

	deleteAtPosition(pos) {
		this.state.route.splice(pos, 1);
		this.state.smite.splice(pos, 1);

		this.forceUpdate();
	}

	clearRoute() {
		this.setState({route: [], smite: []});
	}

	routeToAPIString() {
		var ret = "";
		//Add camp code, add S if smite, add comma.
		this.state.route.forEach((camp, position) => ret += camp.code + (this.state.smite[position] ? "S" : "") + ",");

		//Truncate trailing comma and return.
		return ret.slice(0, -1);
	}

	createRoute() {
		this.setState({routeImage: '/api/buildRoute/' + this.routeToAPIString()});
		console.log(this.state.routeImage);
	}

	render() {
		return (
			<div style={pageStyle}>
				<h1>Jungle.Ninja Route Builder</h1>
				<section>
					<RoutePicker insertFunction={this.addToRoute}/>
					<RoutePreview route={this.state.route} smites={this.state.smite}  deleteFunction={this.deleteAtPosition}/>
				</section>
				<section>
					<button style={submitStyle} onClick={this.clearRoute}>Clear Route</button>
					<input style={submitStyle} onClick={this.createRoute} type="submit" value="Create Route" />
				</section>
				<FinishedRoute routeImage={this.state.routeImage} />
			</div>
		);
	}

}

export default RouteBuilder;