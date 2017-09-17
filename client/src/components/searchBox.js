import React from 'react';
import ChampionInput from './championInput';
import {Redirect} from 'react-router';

const largeFormStyle = {
	"text-align": "center",
	display: "block",
	margin: "20px auto",
	width: 500
};

const formStyle = {
	"text-align": "center",
	display: "inline-block",
	padding: "35px 0px",
	float: "right"
};

const submitStyle = (large=false) => ({
	"font-size": large ? 30 : 20,
	width: large ? "100%" : undefined,
	"text-align": "center",
	padding: large ? 10 : 0
});

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
		const large = this.props.size === "large";
		//If redirect is enabled, send to the page for that champion.
		if (this.state.redirect) {
			return (
				//Include whole form in case redirect is to same page..
				<form className={large ? "search-large" : "search"} onSubmit={this.onSubmit} style={large ? largeFormStyle : formStyle}> 
					<Redirect push to={"/champion/"+this.state.champ} />
					<ChampionInput onChange={this.champChanged} value={this.state.champ} size={this.props.size}/>
					<input type="submit" value="Go!" style={submitStyle(this.props.size === "large")}/>
				</form>
			);
		}

		//Otherwise, return the Champion Input Search field and the submit button.
		return (
			<form className={large ? "search-large" : "search"} onSubmit={this.onSubmit} style={large ? largeFormStyle : formStyle}> 
				<ChampionInput onChange={this.champChanged} value={this.state.champ} size={this.props.size}/>
				<input type="submit" value="Go!" style={submitStyle(this.props.size === "large")}/>
			</form>
			)
	}

}

export default SearchBox;