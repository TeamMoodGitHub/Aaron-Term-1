import React from 'react';
import ChampionInput from './championInput';
import {Redirect} from 'react-router';

class SearchBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			champ: ''
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.champChanged = this.champChanged.bind(this);
	}

	//Called by input form when value changes.
	champChanged(val) {
		this.setState({
			champ: val
		});
	}

	//Called when form is submitted.
	onSubmit(e) {
		e.preventDefault();
		if (!this.state.champ) {
			//alert("You didn't enter anything!");
			return;
		}
		//Prevent default form actions.
		//Manually redirect user to next page.
		this.setState({redirect: true});
	}

	render() {

		//If redirect is enabled, send to the page for that champion.
		if (this.state.redirect) {
			return <Redirect push to={"/champion/"+this.state.champ.toLowerCase().replace(" ", "-")} />;
		}

		//Otherwise, return the Champion Input Search field and the submit button.
		return (
			<form className={this.props.size === "large" ? "search-large" : "search"} onSubmit={this.onSubmit}> 
				<ChampionInput onChange={this.champChanged} value={this.state.champ}/>
				<input type="submit" value="Go!"/>
			</form>
			)
	}

}

export default SearchBox;