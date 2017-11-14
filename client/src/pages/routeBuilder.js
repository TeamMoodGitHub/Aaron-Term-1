import React from 'react';

import RoutePicker from '../route-builder/routePicker';
import RoutePreview from '../route-builder/routePreview';
import FinishedRoute from '../route-builder/finishedRoute';

const pageStyle = {
	"font-family": "AppleGothic",
	"text-align": "center"
};

class RouteBuilder extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={pageStyle}>
				<h1>Jungle.Ninja Route Builder</h1>
				<section>
					<RoutePicker />
					<RoutePreview />
				</section>
				<section>
					<input type="submit" />
				</section>
				<FinishedRoute/>
			</div>
		);
	}

}

export default RouteBuilder;