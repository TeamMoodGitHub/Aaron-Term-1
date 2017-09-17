import React from 'react';
import {Link} from 'react-router-dom';

class JungleRoutes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			blueSide: true,
		};

		this.getRoutes = this.getRoutes.bind(this);
		this.toggleSides = this.toggleSides.bind(this);
	}

	componentDidMount() {
		this.getRoutes();
	}

	getRoutes() {
		fetch('/api/jungler/'+this.props.champ+'/jungleRoutes/' + (this.state.blueSide ? 'blue' : 'red'))
			.then(res => res.json())
			.then(routes => this.setState({routes}));
	}

	toggleSides(e) {
		//Currently only called from button. If called elsewhere, add check to ensure e is defined.
		e.preventDefault();
		this.setState({
			blueSide: !this.state.blueSide,
			routes: null
		});
		this.getRoutes();
	}

	render() {
		//console.log(JSON.stringify(this.state));
		if (!this.state.routes) {
			//Still include red/blue buttons
			return <h1> Loading Jungle Routes... </h1>;
		}
		return (
			<div id="jungleRoutes">
				<h1>Jungle Routes</h1>
				<Link to={'/champion/'+this.props.champ+'/newPath'}><button>Create new Jungle Route!</button></Link>
				<button onClick={this.toggleSides}>Toggle Sides</button>
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