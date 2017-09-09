import React from 'react';

class JungleRoutes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			blueSide: true,

			//For debugging purposes - will be removed.
			routes: [
				{
					path: [4,9,6,3,1],
					score: 2497
				},
				{
					path: [5,4,8,9,1],
					score: 2497
				},
				{
					path: [3,6,5,5,2],
					score: 2497
				}
			]
		};

		this.getRoutes = this.getRoutes.bind(this);
		this.toggleSides = this.toggleSides.bind(this);
	}

	componentDidMount() {
		this.getRoutes();
	}

	getRoutes() {
		fetch('/api/champion/'+this.props.champ+'/jungleRoutes/' + (this.state.blueSide ? 'blue' : 'red'))
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
		if (this.state.routes === null) {
			//Still include red/blue buttons
			return <h1> Loading Jungle Routes... </h1>;
		}
		return (
			<div id="jungleRoutes">
				<button onClick={this.toggleSides}>Toggle Sides</button>
				{
					this.state.routes.map(route => 
						(
						<div class="route">
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