import React from 'react';

import Header from '../components/header';

import ChampionHeader from '../components/championHeader';
import StartingItems from '../components/startingItems';
import JungleRoutes from '../components/jungleRoutes';

const pageBodyStyle = {
	padding: "10px 50px"
}

class Champion extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			query: this.props.match.params.championName,
			found: false
		}
	}

	componentDidMount() {
		this.loadChampionDetails();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.key !== this.props.location.key) {
			this.setState({
				query: nextProps.match.params.championName,
				found: false,
				champion: null
			}, this.loadChampionDetails);
		}
	}

	loadChampionDetails() {
		fetch('/api/champion/' + this.state.query)
			.then(res => res.json())
			.then(champInfo => this.setState( {
				champion: champInfo,
				found: champInfo.found !== -1
			}));
	}

	render() {

		//Searching for no champion?! What?!?
		if (!this.state.query) {
			return (
				<h1> You're not searching for anything!! </h1>
				);
		} else if (!this.state.champion || !this.props.version) {
			//Pass javascript object with only search query as champion name while loading.
			return (
				<ChampionHeader champ={{name: this.props.match.params.championName}} />
			);
		} else if (!this.state.found) {
			return (
				<h1> Oh no! We could not find the Champion you were looking for! </h1>
			);
		}

		return (
			<div className="page">
				<Header />
				<div className="pageBody" style={pageBodyStyle}>
					<ChampionHeader champ={this.state.champion} version = {this.props.version}/>
					<StartingItems champ={this.state.query} version={this.props.version} />
					<JungleRoutes champ={this.state.query} />
				</div>
			</div>
			);
	}
}

export default Champion;