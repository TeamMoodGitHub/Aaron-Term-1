import React from 'react';
import {Link} from 'react-router-dom';

class StartingItems extends React.Component {

	constructor(props) {
		super(props);

		//Set state to blank object rather than undefined so render() can attempt to access state values.
		this.state = {};

		this.getStartingItems = this.getStartingItems.bind(this);
		this.vote = this.vote.bind(this);
	}

	componentDidMount() {
		this.getStartingItems();
	}

	getStartingItems() {
		fetch('/api/jungler/'+this.props.champ+'/itemSets')
			.then(res => res.json())
			.then(startingItems => this.setState({startingItems}));
	}

	vote(id, upvote) {
		fetch('/api/jungler/'+this.props.champ+'/itemSet/' + (upvote ? "inc/" : "dec/") + id, {
    		headers: {
		    	'Accept': 'application/json, text/plain, */*',
		    	'Content-Type': 'application/json'
		    },
		    method: "POST"
    	})
    	.then((res) => res.json())
    	.then((json) => {
    		if (json.success) {
    			this.getStartingItems();
    		} else {
    			alert("There was a problem with your request. Please try again later.");
    		}
    	});
	}

	render() {
		//console.log(JSON.stringify(this.state));
		if (!this.state.startingItems) {
			//Still include red/blue buttons
			return <h1> Loading Starting Items... </h1>;
		}
		return (
			<div id="startingItems">
				<h1> Starting Items </h1>
				<Link to={'/champion/'+this.props.champ+'/newSet'}><button>Create new Item Set!</button></Link>
				{
					this.state.startingItems.map(startingItemSet => 
						(
						<div class="startingItemSet">
							<h3>{startingItemSet._id}: {JSON.stringify(startingItemSet.set)}</h3> 
							<h4>Score: {startingItemSet.score}</h4>
							<button onClick={() => this.vote(startingItemSet._id, true)}><p>+</p></button>
							<button onClick={() => this.vote(startingItemSet._id, false)}><p>-</p></button>
						</div>
						)
					)
				}
			</div>
		)
	}

}

export default StartingItems;