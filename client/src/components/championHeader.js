import React from 'react';

class ChampionHeader extends React.Component {

	render() {

		const champion = this.props.champ;

		const name = champion.name || "Loading...";
		const title = champion.title || "Loading...";
		const image = champion.image ? "http://ddragon.leagueoflegends.com/cdn/"+this.props.version+"/img/champion/" + champion.image.full : ""; 
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