import React from 'react';

class StartingItems extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			startingItems: 
			[
				{
					id: 1,
					items: [123,234,345,456],
					score: 25
				},
				{
					id: 2,
					items: [4,7,1,2],
					score: 10
				}
			]
		};

		this.getStartingItems = this.getRoutes.bind(this);
	}

	componentDidMount() {
		this.getStartingItems();
	}

	getStartingItems() {
		fetch('/api/champion/'+this.props.champ+'/startingItems'))
			.then(res => res.json())
			.then(routes => this.setState({routes}));
	}

	render() {
		//console.log(JSON.stringify(this.state));
		if (this.state.startingItems === null) {
			//Still include red/blue buttons
			return <h1> Loading Starting Items... </h1>;
		}
		return (
			<div id="startingItems">
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