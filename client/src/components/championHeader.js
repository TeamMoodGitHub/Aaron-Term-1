import React from 'react';

class ChampionHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			champ: this.props.champ,
			title: "",
			image: null,
			winRatePercentage: 0,
			winRateGameCount: 0
		}
	}

	componentDidMount() {
		this.loadChampionDetails();
	}

	loadChampionDetails() {
		fetch('/api/champion/' + this.props.champ)
			.then(res => res.json())
			.then(champInfo => this.setState(champInfo));
	}

	render() {

		if (this.state.found === -1) {
			return (
				<div class="notFound">
					<p>Unfortunately, we could not find this champion!</p>
				</div>
			);
		}

		const name = this.state.name || this.state.champ;
		const title = this.state.title || "Loading...";
		const image = this.state.image ? "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + this.state.image.full : "Loading..."; 
		const winRatePercentage = 50 //this.state.winRatePercentage || "Loading...";
		const winRateGameCount = 0 //this.state.winRateGameCount || "Loading...";

		return (

			<div class="champHeader">

				<img src={image} />
				<div class="champHeaderNamePanel">
					<h2>{name}</h2>
					<h3>{title}</h3>
				</div>
				{/*Tags*/}
				<div class="champHeaderWinRatePanel">
					<h2>Current Win Rate</h2>
					<h2>{winRatePercentage}%</h2>
					<h3>(From {winRateGameCount} games)</h3>
				</div>	

			</div>

		);
	}
}

export default ChampionHeader;