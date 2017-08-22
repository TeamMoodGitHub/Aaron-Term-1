import React from 'react';

//import ChampionHeader from './championHeader';
//import StartingItems from './startingItems';
//import JungleRoutes from './jungleRoutes';

class Champion extends React.Component {

	render() {

		const champName = this.props.match.params.championName

		//Searching for no champion?! What?!?
		if (!champName) {
			return (
				<h1> You're not searching for anything!! </h1>
				);
		}

		return (
			<div>
				<h1>Champion: {this.props.match.params.championName}</h1>
				{/*<ChampionHeader champ={champName} />*/}
				{/*<StartingItems champ={champName} />*/}
				{/*<JungleRoutes champ={champName} />*/}
			</div>
			);
	}
}

export default Champion;