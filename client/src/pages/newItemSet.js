import React from 'react';

import Item from '../components/item';
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

		this.getItems();
	}

	getItems() {
		fetch('/api/items')
		.then((res) => res.json())
		.then((items) => this.setState({items}));
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
		    body: JSON.stringify(this.state.set)
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
    		set: this.state.set.concat(item.key)
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
					<h1>Create a new Item Set for: {this.props.match.params.championName}</h1>
					<h1>Loading Items...</h1>
				</div>
			);
		} else {
			return (
				<div id="itemSetCreator">
					<h1>Create a new Item Set for: {this.props.match.params.championName}</h1>
					<h1>State: {JSON.stringify(this.state.set)}</h1>
					<button onClick={this.submit}><p>Submit</p></button>
					<button onClick={this.clearSet}><p>Clear Items</p></button>
					<div id="items">
						{this.state.items.map(item => <Item onClick={() => this.addToSet(item)} button={true} item={item} />)}
					</div>
				</div>
			);
		}
		
	}

}

export default NewItemSet;