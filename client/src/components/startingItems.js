import React from 'react';

class StartingItems extends React.Component {

	constructor(props) {
		super(props);

		//Set state to blank object rather than undefined so render() can attempt to access state values.
		this.state = {};

		this.getStartingItems = this.getStartingItems.bind(this);
	}

	componentDidMount() {
		this.getStartingItems();
	}

	getStartingItems() {
		fetch('/api/jungler/'+this.props.champ+'/startingItems')
			.then(res => res.json())
			.then(startingItems => this.setState({startingItems}));
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
				{
					this.state.startingItems.map(startingItemSet => 
						(
						<div class="startingItemSet">
							<h3>{startingItemSet.id}: {JSON.stringify(startingItemSet.items)}</h3> 
							<h4>Score: {startingItemSet.score}</h4>
						</div>
						)
					)
				}
			</div>
		)
	}

}

export default StartingItems;