import React from 'react';
import {Link} from 'react-router-dom';
import JungleRoute from './jungleRoute';

class JungleRoutes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			routes: null
		};
		this.getRoutes = this.getRoutes.bind(this);
		this.vote = this.vote.bind(this);
	}

	componentDidMount() {
		this.getRoutes();
	}

	getRoutes() {
		fetch('/api/jungler/'+this.props.champ+'/jungleRoutes')
			.then(res => res.json())
			.then(routes => this.setState({routes}));
	}

	/**
	* Submits a user vote by making POST Request to the API.
	* If successful, the API will return a JSON object with the 
	* "success" key set to true. If successful, then this component
	* will be re-rendered with new data.
	*/
	vote(id, upvote) {
		fetch('/api/jungler/'+this.props.champ+'/jungleRoute/' + (upvote ? "inc/" : "dec/") + id, {
    		headers: {
		    	'Accept': 'application/json, text/plain, */*',
		    	'Content-Type': 'application/json'
		    },
		    method: "POST"
    	})
    	.then((res) => res.json())
    	.then((json) => {
    		if (json.success) {
    			this.getRoutes();
    		} else {
    			alert("There was a problem with your request. Please try again later.");
    		}
    	});
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
						<div className="route">
							<JungleRoute route={route.route} />
							<h4>Score: {route.score}</h4>
							<button onClick={() => this.vote(route._id, true)}><p>+</p></button>
							<button onClick={() => this.vote(route._id, false)}><p>-</p></button>
						</div>
						)
					)
				}
			</div>
		)
	}

}

export default JungleRoutes;