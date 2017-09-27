import React from 'react';
import Radium from 'radium';

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
				<div id="jungleRoutesHeader">
					<h1 style={{display: "inline-block"}}>Jungle Routes</h1>
					<Link style={{margin: 15}} to={'/champion/'+this.props.champ+'/newPath'}><button style={{"font-size": 20}}>+</button></Link>
				</div>
				{
					this.state.routes.map(route => 
						(
						<div className="route" style={{display: "flex", "align-items": "center"}}>
							<JungleRoute route={route.route} />
							<div style={{display: "inline-block", "vertical-align": "top", "width": "10%", "text-align": "center"}} className="scoreInfo">
								<button onClick={() => this.vote(route._id, true)}><p style={{margin:0}}>+</p></button>
								<h4 style={{margin: "10px 0px", "text-align": "center"}}>{route.score}</h4>
								<button onClick={() => this.vote(route._id, false)}><p style={{margin:0}}>-</p></button>
							</div>
						</div>
						)
					)
				}
			</div>
		)
	}

}

export default Radium(JungleRoutes);