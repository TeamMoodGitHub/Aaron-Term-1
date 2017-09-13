import React from 'react';

const headerStyle = {
	display: "flex",
	"justify-content": "space-between",
	"flex-wrap": "wrap"
}

const imgStyle = {
	"object-fit": "contain"
}

const divStyle = {
	display: "inline-block",
	"vertical-align": "top",
	padding: "0px 10px"
};

class ChampionHeader extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.getWinRates = this.getWinRates.bind(this);
	}

	componentDidMount() {
		this.getWinRates();
	}

	getWinRates() {
		if (this.props.champ.key) {
			fetch('/api/champion/' + this.props.champ.key + '/wr')
				.then(res => res.json())
				.then(championWinRate => this.setState({championWinRate}));
			fetch('/api/jungler/' + this.props.champ.key + '/wr')
				.then(res => res.json())
				.then(junglerWinRate => this.setState({junglerWinRate}));
		}
	}

	render() {

		const champion = this.props.champ;
		const championWinRateData = this.state.championWinRate;
		const junglerWinRateData = this.state.junglerWinRate;

		const name = champion.name || "Loading...";
		const title = champion.title || "Loading...";
		const image = champion.image ? "http://ddragon.leagueoflegends.com/cdn/"+this.props.version+"/img/champion/" + champion.image.full : ""; 

		const champWinRatePercentage =  championWinRateData ? (100 * (championWinRateData.wins || 0) / championWinRateData.games).toFixed(2) + "%" : "Loading...";
		const champWinRateGameCount =  championWinRateData ? championWinRateData.games : "Loading...";

		const junglerWinRatePercentage =  junglerWinRateData ? (100 * (junglerWinRateData.wins || 0) / junglerWinRateData.games).toFixed(2) + "%" : "Loading...";
		const junglerWinRateGameCount =  junglerWinRateData ? junglerWinRateData.games : "Loading...";

		return (

			<div style={headerStyle} className="champHeader">
				<div className="champHeaderMainPanel">
					<img style={imgStyle} src={image} alt={"Splash logo for " + name}/>
					<div style={divStyle} className="champHeaderNamePanel">
						<h2>{name}</h2>
						<h3>{title}</h3>
					</div>
				</div>
				{/*Tags*/}
				<div style={divStyle} className="champHeaderWinRatePanel">
					<h2>Current Win Rate</h2>
					<h2>{champWinRatePercentage}</h2>
					<h3>(From {champWinRateGameCount} ranked games)</h3>
				</div>	
				<div style={divStyle} className="junglerHeaderWinRatePanel">
					<h2>Current Win Rate when Jungling</h2>
					<h2>{junglerWinRatePercentage}</h2>
					<h3>(From {junglerWinRateGameCount} ranked games)</h3>
				</div>	

			</div>

		);
	}
}

export default ChampionHeader;