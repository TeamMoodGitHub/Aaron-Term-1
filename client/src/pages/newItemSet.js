import React from 'react';

import Item from '../components/item';
import Header from '../components/header';

import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';

const divStyle = {
	padding: "10px 50px",
	"text-align": "center"
};

const buttonStyle = {
	margin: "0px 30px"
};

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
				<div id="itemSetCreator" style={divStyle}>
					<Header />
					<h1>Create a new Item Set for: {this.getNameFromID(this.props.match.params.championName)}</h1>
					<h1>Loading Items...</h1>
				</div>
			);
		} else {
			return (
				<div>
				<Header />
				<div id="itemSetCreator" style={divStyle}>
					<Link to={"/champion/"+this.props.match.params.championName}><button style={{"margin": "1.5em 0em", float: "left"}}><h3 style={{display: "inline-block"}}>&lt; Back</h3></button></Link>
					<h1 style={{display: "inline-block"}}>Create a new Item Set for: {this.getNameFromID(this.props.match.params.championName)}</h1>
					<div id="items">
						{
							//Only display items that are purchasable on summoner's rift
							this.state.items.map(item => 
								item.gold.purchasable && item.maps[10] && <Item onClick={() => this.addToSet(item)} button={true} item={item} version={this.props.version} />
								)

						}
					</div>
					<h1>Current Items: {this.state.set.map(item => <Item item={item} version={this.props.version} />)}</h1>
					<div id="formButtons" style = {{"text-align": "center"}}>
						<button style={buttonStyle} onClick={this.clearSet}><p>Clear Items</p></button>
						<button style={buttonStyle} onClick={this.submit}><p>Submit</p></button>
					</div>
				</div>
				</div>
			);
		}
		
	}

}

export default NewItemSet;