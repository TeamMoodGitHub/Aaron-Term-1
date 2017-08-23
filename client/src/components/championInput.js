import React from 'react';
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
	<div className="suggestion">
		<h3>{suggestion.name}: {JSON.stringify(suggestion.tags ? suggestion.tags : suggestion.description)}</h3>
	</div>
);

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
		fetch('/api')
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