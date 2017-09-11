import React from 'react';
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion.key;

const renderSuggestion = suggestion => {

	const suggestionStyle = {padding: "20px 0", margin: 0};

	return (
		<div className="suggestion">
			<h3 style={suggestionStyle}>{suggestion.name}: {suggestion.title}</h3>
		</div>
	);
};

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

const theme = {};

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
		const input = value.trim().toLowerCase();
		const length = input.length;

		return length === 0 ? [] : this.state.champions.filter(champ => 
			champ.name.toLowerCase().startsWith(input)
			);
	}

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
				renderSuggestion = {renderSuggestion}
				inputProps = {inputProps}
			/>
		)
	}

}

export default ChampionInput;