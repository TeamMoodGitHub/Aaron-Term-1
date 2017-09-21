import React from 'react';
import {Router,  Route, Switch} from 'react-router';

import Home from './pages/home';
import Champion from './pages/champion';
import NotFound from './pages/notFound';
import NewJunglePath from './pages/newJunglePath';
import NewItemSet from './pages/newItemSet';

class Routes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.getPatchNumber = this.getPatchNumber.bind(this);

		this.getPatchNumber();
	}

	getPatchNumber() {
		fetch('https://ddragon.leagueoflegends.com/api/versions.json')
			.then(res => res.json())
			.then(versions => this.setState({
				version: versions[0]
			}));
	}

	render() {

		if (!this.state.version) {
			return (<div id="loading" />);
		}

		return (
			<Router {...this.props}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/champion/:championName?/newPath" render={(props) => <NewJunglePath {...props} version={this.state.version} />}/>
					<Route path="/champion/:championName?/newSet" render={(props) => <NewItemSet {...props} version={this.state.version} />} />
					<Route path="/champion/:championName?" render={(props) => <Champion {...props} version={this.state.version} />}/>
					<Route path="*" component={NotFound} />
				</Switch>
			</Router>
		);
	}
}

export default Routes;