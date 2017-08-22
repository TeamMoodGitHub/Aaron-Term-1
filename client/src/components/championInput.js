import React from 'react';
import Autosuggest from 'react-autosuggest';
import champions from '../data/champions';

const getSuggestions = value => {
	const input = value.trim().toLowerCase();
	const length = input.length;

	return length === 0 ? [] : champions.filter(champ => 
		champ.name.toLowerCase().startsWith(input)
		);
}

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
	<div className="suggestion">
		<h3>{suggestion.name}: {JSON.stringify(suggestion.tags)}</h3>
	</div>
);

class ChampionInput extends React.Component {


	//Initializes the state of the search box.
	constructor(props) {
		super(props);
		this.state = {
			suggestions: []
		};
	}

	//Called when user types into text box.
	onChange = (event, {newValue}) => {
		this.props.onChange(newValue);
	};

	//Called when suggestions are fetched.
	onSuggestionsFetchRequested = ({value}) => {
		this.setState({
			suggestions: getSuggestions(value)
		});
	};

	//Called when suggestions are cleared.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
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