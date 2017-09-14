import React from 'react';

import '../jungleCamps.css';

import riftMap from '../images/riftMap.png';
import dragon from '../images/dragon.png';
import baron from '../images/baron.png';
import red from '../images/red.png';
import blue from '../images/blue.png';
import gromp from '../images/gromp.png';
import wolves from '../images/wolves.png';
import raptors from '../images/raptors.png';
import krugs from '../images/krugs.png';
import blueSide from '../images/blueSide.png';
import redSide from '../images/redSide.png';
import swords from '../images/swords.png';

class NewJunglePath extends React.Component {

	render() {
		return (
			<div>
				<h1>Create a new Jungle Path for: {this.props.match.params.championName}</h1>
				<div id="routeMaker">
					<img id="map" src={riftMap} alt="Summoner's Rift Map"/>
					
					<img id="dragon" className="mob" src={dragon} alt="Dragon" />
					<h2 id="dragonLabel" className="mobLabel">Dragon!</h2>
					<img id="baron" className="mob" src={baron} alt="Baron!" />
					<h2 id="baronLabel" className="mobLabel">Baron Nashor!</h2>

					<img id="top" className="mob" src={swords} alt="Gank top" />
					<h2 id="topLabel" className="mobLabel">Gank Top!</h2>
					<img id="mid" className="mob" src={swords} alt="Gank mid!" />
					<h2 id="midLabel" className="mobLabel">Gank Mid!</h2>
					<img id="bot" className="mob" src={swords} alt="Gank bot!" />
					<h2 id="botLabel" className="mobLabel">Gank Bot!</h2>

					<img id="blueBase" className="mob" src={blueSide} alt="Blue Side Base" />
					<h2 id="blueBaseLabel" className="mobLabel">Blue Base!</h2>
					<img id="blueGromp" className="mob" src={gromp} alt="Blue Gromp" />
					<h2 id="blueGrompLabel" className="mobLabel">Blue Gromp!</h2>
					<img id="blueWolves" className="mob" src={wolves} alt="Blue Wolves" />
					<h2 id="blueWolvesLabel" className="mobLabel">Blue Wolves!</h2>
					<img id="blueBlue" className="mob" src={blue} alt="Blue Side Blue Buff" />
					<h2 id="blueBlueLabel" className="mobLabel">Blue Side Blue Buff!</h2>
					<img id="blueRaptors" className="mob" src={raptors} alt="Blue Raptors" />
					<h2 id="blueRaptorsLabel" className="mobLabel">Blue Raptors!</h2>
					<img id="blueRed" className="mob" src={red} alt="Blue Side Red Buff" />
					<h2 id="blueRedLabel" className="mobLabel">Blue Side Red Buff!</h2>
					<img id="blueKrugs" className="mob" src={krugs} alt="Blue Krugs" />
					<h2 id="blueKrugsLabel" className="mobLabel">Blue Krugs!</h2>


					<img id="redBase" className="mob" src={redSide} alt="Red Side Base" />
					<h2 id="redBaseLabel" className="mobLabel">Red Base!</h2>
					<img id="redGromp" className="mob" src={gromp} alt="Red Gromp" />
					<h2 id="redGrompLabel" className="mobLabel">Red Gromp!</h2>
					<img id="redWolves" className="mob" src={wolves} alt="Red Wolves" />
					<h2 id="redWolvesLabel" className="mobLabel">Red Wolves!</h2>
					<img id="redBlue" className="mob" src={blue} alt="Red Side Blue Buff" />
					<h2 id="redBlueLabel" className="mobLabel">Red Side Blue Buff!</h2>
					<img id="redRaptors" className="mob" src={raptors} alt="Red Raptors" />
					<h2 id="redRaptorsLabel" className="mobLabel">Red Raptors!</h2>
					<img id="redRed" className="mob" src={red} alt="Red Side Red Buff" />
					<h2 id="redRedLabel" className="mobLabel">Red Side Red Buff!</h2>
					<img id="redKrugs" className="mob" src={krugs} alt="Red Krugs" />
					<h2 id="redKrugsLabel" className="mobLabel">Red Krugs!</h2>
				</div>
			</div>
		);
	}

}

export default NewJunglePath;