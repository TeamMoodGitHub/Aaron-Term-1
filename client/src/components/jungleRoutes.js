import React from 'react';
import {Link} from 'react-router-dom';

class JungleRoutes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			routes: null
		};
		this.getRoutes = this.getRoutes.bind(this);
	}

	componentDidMount() {
		this.getRoutes();
	}

	getRoutes() {
		fetch('/api/jungler/'+this.props.champ+'/jungleRoutes')
			.then(res => res.json())
			.then(routes => this.setState({routes}));
	}

	render() {
		//console.log(JSON.stringify(this.state));
		if (!this.state.routes) {
			return <h1> Loading Jungle Routes... </h1>;
		}
		return (
			<div id="jungleRoutes">
				<h1>Jungle Routes</h1>
				<Link to={'/champion/'+this.props.champ+'/newPath'}><button>Create new Jungle Route!</button></Link>
				{
					this.state.routes.map(route => 
						(
						<div class="route">
							<h3>ID: {route.id}</h3>
							<h3>Path: {JSON.stringify(route.path)}</h3> 
							<h4>Score: {route.score}</h4>
						</div>
						)
					)
				}
			</div>
		)
	}

}

export default JungleRoutes;