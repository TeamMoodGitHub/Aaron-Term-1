import React from 'react';
import Autosuggest from 'react-autosuggest';

import Loading from './loading';

const getSuggestionValue = suggestion => suggestion ? suggestion.key : "";



const largeSuggestionStyle = {padding: "20px 0", margin: 0};
const suggestionStyle = {padding: "20px 0", margin: 0, "font-size": 15}

const largeTheme = {
	container: {
		padding: 10
	},
	input: {
		"font-size": 30,
		width: "100%",
		"text-align": "center"
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		"list-style-type": "none"
	},
	suggestion: {
		cursor: "pointer",
		margin: 0,
		padding: 0
	},
	suggestionHighlighted: {
		"background-color": "#ddd"
	}
};

const theme = {
	container: {
		display: "inline-block",
		"margin-right": 15
	},
	input: {
		"font-size": 20,
		"text-align": "center"
	},	
	suggestionsList: {
		margin: 0,
		padding: 0,
		"list-style-type": "none",
		position: "absolute",
		width: 214
	},
	suggestion: {
		cursor: "pointer",
		margin: 0,
		padding: 0,
		"background-color": "white"
	},
	suggestionHighlighted: {
		"background-color": "#ddd"
	},

};

class ChampionInput extends React.Component {

	//Initializes the state of the search box.
	constructor(props) {
		super(props);
		this.state = {
			suggestions: [],
			champions: []
		};
	}

	componentDidMount() {
		this.loadChampionsFromAPI();
	};

	loadChampionsFromAPI() {
		fetch('/api/champions')
			.then(res => res.json())
			.then(champions => this.setState({champions}));
	}

	//Called when user types into text box.
	onChange = (event, {newValue}) => {
		this.props.onChange(newValue);
	};

	//Called when suggestions are fetched.
	onSuggestionsFetchRequested = ({value}) => {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	};

	//Called when suggestions are cleared.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	getSuggestions = value => {

		if (this.state.champions.length === 0) {
			return ["loading"];
		}

		const input = value.trim().toLowerCase();
		const length = input.length;
		return length === 0 ? [] : this.state.champions.filter(champ => 
			champ.name.toLowerCase().startsWith(input)
			);
	}

	renderSuggestion = suggestion => {

		if (suggestion === "loading") {
			return <Loading positioned={true}/>;
		}

		return (
			<div className="suggestion">
				<h3 style={this.props.size==="large" ? largeSuggestionStyle : suggestionStyle}>{suggestion.name}: {suggestion.title}</h3>
			</div>
		);
	};

	render() {
		const {suggestions} = this.state;
		const text = this.props.value;
		const inputProps = {
			placeholder: "Enter a Champion!",
			value: text,
			onChange: this.onChange
		};

		return (
			<Autosuggest
				theme = {this.props.size === "large" ? largeTheme : theme}
				suggestions = {suggestions}
				onSuggestionsFetchRequested = {this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested = {this.onSuggestionsClearRequested}
				getSuggestionValue = {getSuggestionValue}
				renderSuggestion = {this.renderSuggestion}
				inputProps = {inputProps}
			/>
		)
	}

}

export default ChampionInput;