import React from 'react';

import Item from '../components/item';

import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';

class NewItemSet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: null,
			set: []
		}

		this.getItems = this.getItems.bind(this);
		this.submit = this.submit.bind(this);
		this.clearSet = this.clearSet.bind(this);
		this.addToSet = this.addToSet.bind(this);

	}

	componentDidMount() {
		this.getItems();
		this.loadChampionsFromAPI();
	}

	getItems() {
		fetch('/api/items')
		.then((res) => res.json())
		.then((items) => this.setState({items}));
	}

	loadChampionsFromAPI() {
		fetch('/api/champions')
			.then(res => res.json())
			.then(champions => this.setState({champions}));
	}

	getNameFromID(name) {
		if (this.state.champions) {
			for (var i=0;i<this.state.champions.length;i++) {
				if (this.state.champions[i].key === name) {
					return this.state.champions[i].name;
				}
			}
		} 
		return name;
	}


	submit() {
    	if (!this.state.set || this.state.set.length <= 0) {
    		return;
    	}
    	fetch('/api/jungler/'+this.props.match.params.championName+'/itemSet', {
    		headers: {
		    	'Accept': 'application/json, text/plain, */*',
		    	'Content-Type': 'application/json'
		    },
		    method: "POST",
		    body: JSON.stringify(this.state.set.map(item => item.key))
    	})
    	.then((res) => res.json())
    	.then((json) => {
    		if (json.success) {
    			this.setState({redirect: true});
    		} else {
    			alert("There was a problem with your submission: " + json);
    		}
    	});
    }

    addToSet(item) {
    	this.setState({
    		set: this.state.set.concat(item)
    	});
    }

    clearSet() {
    	this.setState({
    		set: []
    	});
    }

	render() {
		if (this.state.redirect) {
			return <Redirect push to={"/champion/"+this.props.match.params.championName} />;
		} else if (!this.state.items) {
			return (
				<div id="itemSetCreator">
					<h1>Create a new Item Set for: {this.getNameFromID(this.props.match.params.championName)}</h1>
					<h1>Loading Items...</h1>
				</div>
			);
		} else {
			return (
				<div id="itemSetCreator">
					<Link to={"/champion/"+this.props.match.params.championName}><h3>Back</h3></Link>
					<h1>Create a new Item Set for: {this.getNameFromID(this.props.match.params.championName)}</h1>
					<div id="items">
						{
							//Only display items that are purchasable on summoner's rift
							this.state.items.map(item => 
								item.gold.purchasable && item.maps[10] && <Item onClick={() => this.addToSet(item)} button={true} item={item} version={this.props.version} />
								)

						}
					</div>
					<h1>Current Items: {this.state.set.map(item => <Item item={item} version={this.props.version} />)}</h1>
					<button onClick={this.clearSet}><p>Clear Items</p></button>
					<button onClick={this.submit}><p>Submit</p></button>
				</div>
			);
		}
		
	}

}

export default NewItemSet;