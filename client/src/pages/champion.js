import React from 'react';

import Header from '../components/header';

import ChampionHeader from '../components/championHeader';
import StartingItems from '../components/startingItems';
import JungleRoutes from '../components/jungleRoutes';


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
		this.getPatchNumber();
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
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

	getPatchNumber() {
		fetch('https://ddragon.leagueoflegends.com/api/versions.json')
			.then(res => res.json())
			.then(versions => this.setState({
				version: versions[0]
			}));
	}

	render() {

		//console.log(this.props);

		//Searching for no champion?! What?!?
		if (!this.state.query) {
			return (
				<h1> You're not searching for anything!! </h1>
				);
		} else if (!this.state.champion || !this.state.version) {
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
			<div>
				<Header />
				<ChampionHeader champ={this.state.champion} version = {this.state.version}/>
				<StartingItems champ={this.state.champion.name} />
				<JungleRoutes champ={this.state.champion.name} />
			</div>
			);
	}
}

export default Champion;