import React from 'react';

class ChampionHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		const name = this.props.name;
		const subtitle = "The Blind Monk";
		const img = "http://www.mobafire.com/images/champion/icon/lee-sin.png";
		const winRatePercentage = 48;
		const winRateGameCount = 1300;

		return (

			<div class="champHeader">

				<img src={img} />
				<div class="champHeaderNamePanel">
					<h2>{name}</h2>
					<h3>{subtitle}</h3>
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