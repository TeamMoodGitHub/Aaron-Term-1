import React from 'react';

import {Redirect} from 'react-router';

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

	constructor(props) {
		super(props);
		this.state = {
			route: [],
			lastX: -1,
			lastY: -1,
			redirect: false
		};

		this.clearRoute = this.clearRoute.bind(this);
		this.addToRoute = this.addToRoute.bind(this);
		this.mapLoaded = this.mapLoaded.bind(this);
		this.submit = this.submit.bind(this);
	}

	componentDidMount() {
	  window.addEventListener('resize', this.mapLoaded)
	}

	componentWillUnmount() {
	  window.removeEventListener('resize', this.mapLoaded)
	}

	clearRoute() {
		var c = this.refs.canvas;
        var ctx = c.getContext("2d");
		ctx.clearRect(0, 0, c.width, c.height);
		this.setState({
			route: [],
			lastX: -1,
			lastY: -1
		});
	}

	addToRoute(val) {
		if (this.state.lastX >= 0 && this.state.lastY >= 0) {
			var toX = val.target.offsetLeft + val.target.width/2;
			var toY = val.target.offsetTop + val.target.height/2

			if (toX - val.target.width/2 > this.state.lastX)
				toX -= this.state.lastX * 0.05;
			else if (toX + val.target.width/2 < this.state.lastX)
				toX += this.state.lastX * 0.05;

			if (toY - val.target.height/2 > this.state.lastY) {
				toY -= this.state.lastY * 0.05;
			}
			else if (toY + val.target.height/2 < this.state.lastY) {
				toY += this.state.lastY * 0.05;
			}

			this.drawArrow(this.state.lastX, this.state.lastY, toX, toY);
		}
		this.setState({
			route: this.state.route.concat(val.target.getAttribute("data-mobID")),
			lastX: val.target.offsetLeft + val.target.width/2,
			lastY: val.target.offsetTop + val.target.height/2
		});
	}

	drawArrow(fromx, fromy, tox, toy){
        //variables to be used when creating the arrow
        var c = this.refs.canvas;
        var ctx = c.getContext("2d");
        var headlen = 10;

        var angle = Math.atan2(toy-fromy,tox-fromx);

        //starting path of the arrow from the start square to the end square and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 10;
        ctx.stroke();

        //starting a new path from the head of the arrow to one of the sides of the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        ctx.strokeStyle = "black";
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fill();
    }

    mapLoaded() {
    	this.refs.canvas.width = this.refs.map.width;
    	this.refs.canvas.height = this.refs.map.height;
    	this.clearRoute();
    }

    submit() {
    	if (!this.state.route || this.state.route.length <= 0) {
    		return;
    	}
    	fetch('/api/jungler/'+this.props.match.params.championName+'/jungleRoute', {
    		headers: {
		    	'Accept': 'application/json, text/plain, */*',
		    	'Content-Type': 'application/json'
		    },
		    method: "POST",
		    body: JSON.stringify(this.state.route)
    	})
    	.then((res) => res.json())
    	.then((json) => {
    		if (json.success) {
    			this.setState({redirect: true});
    		} else {
    			alert("There was a problem with your submission: " + json);
    		}
    	});
    }


	render() {

		if (this.state.redirect) {
			return <Redirect push to={"/champion/"+this.props.match.params.championName} />;
		}

		return (
			<div>
				<h1>Create a new Jungle Path for: {this.props.match.params.championName}</h1>
				<button onClick={this.clearRoute}><p>Clear Route</p></button>
				<p>Current State: {JSON.stringify(this.state.route)}</p>
				<p>Warning! Resizing your window will clear any routes you're in the middle of creating!</p>
				<div id="routeMaker">
					<img ref="map" id="map" src={riftMap} alt="Summoner's Rift Map" onLoad={this.mapLoaded}/>
					
					<img id="dragon" className="mob" src={dragon} alt="Dragon" onClick={this.addToRoute} data-mobID={5} />
					<h2 id="dragonLabel" className="mobLabel">Dragon!</h2>
					<img id="baron" className="mob" src={baron} alt="Baron!" onClick={this.addToRoute} data-mobID={6}/>
					<h2 id="baronLabel" className="mobLabel">Baron Nashor!</h2>

					<img id="top" className="mob" src={swords} alt="Gank top" onClick={this.addToRoute} data-mobID={1}/>
					<h2 id="topLabel" className="mobLabel">Gank Top!</h2>
					<img id="mid" className="mob" src={swords} alt="Gank mid!" onClick={this.addToRoute} data-mobID={2}/>
					<h2 id="midLabel" className="mobLabel">Gank Mid!</h2>
					<img id="bot" className="mob" src={swords} alt="Gank bot!" onClick={this.addToRoute} data-mobID={3}/>
					<h2 id="botLabel" className="mobLabel">Gank Bot!</h2>

					<img id="blueBase" className="mob" src={blueSide} alt="Blue Side Base" onClick={this.addToRoute} data-mobID={10}/>
					<h2 id="blueBaseLabel" className="mobLabel">Blue Base!</h2>
					<img id="blueGromp" className="mob" src={gromp} alt="Blue Gromp" onClick={this.addToRoute} data-mobID={11}/>
					<h2 id="blueGrompLabel" className="mobLabel">Blue Gromp!</h2>
					<img id="blueWolves" className="mob" src={wolves} alt="Blue Wolves" onClick={this.addToRoute} data-mobID={12}/>
					<h2 id="blueWolvesLabel" className="mobLabel">Blue Wolves!</h2>
					<img id="blueBlue" className="mob" src={blue} alt="Blue Side Blue Buff" onClick={this.addToRoute} data-mobID={13}/>
					<h2 id="blueBlueLabel" className="mobLabel">Blue Side Blue Buff!</h2>
					<img id="blueRaptors" className="mob" src={raptors} alt="Blue Raptors" onClick={this.addToRoute} data-mobID={14}/>
					<h2 id="blueRaptorsLabel" className="mobLabel">Blue Raptors!</h2>
					<img id="blueRed" className="mob" src={red} alt="Blue Side Red Buff" onClick={this.addToRoute} data-mobID={15}/>
					<h2 id="blueRedLabel" className="mobLabel">Blue Side Red Buff!</h2>
					<img id="blueKrugs" className="mob" src={krugs} alt="Blue Krugs" onClick={this.addToRoute} data-mobID={16}/>
					<h2 id="blueKrugsLabel" className="mobLabel">Blue Krugs!</h2>


					<img id="redBase" className="mob" src={redSide} alt="Red Side Base" onClick={this.addToRoute} data-mobID={20}/>
					<h2 id="redBaseLabel" className="mobLabel">Red Base!</h2>
					<img id="redGromp" className="mob" src={gromp} alt="Red Gromp" onClick={this.addToRoute} data-mobID={21}/>
					<h2 id="redGrompLabel" className="mobLabel">Red Gromp!</h2>
					<img id="redWolves" className="mob" src={wolves} alt="Red Wolves" onClick={this.addToRoute} data-mobID={22}/>
					<h2 id="redWolvesLabel" className="mobLabel">Red Wolves!</h2>
					<img id="redBlue" className="mob" src={blue} alt="Red Side Blue Buff" onClick={this.addToRoute} data-mobID={23}/>
					<h2 id="redBlueLabel" className="mobLabel">Red Side Blue Buff!</h2>
					<img id="redRaptors" className="mob" src={raptors} alt="Red Raptors" onClick={this.addToRoute} data-mobID={24}/>
					<h2 id="redRaptorsLabel" className="mobLabel">Red Raptors!</h2>
					<img id="redRed" className="mob" src={red} alt="Red Side Red Buff" onClick={this.addToRoute} data-mobID={25}/>
					<h2 id="redRedLabel" className="mobLabel">Red Side Red Buff!</h2>
					<img id="redKrugs" className="mob" src={krugs} alt="Red Krugs" onClick={this.addToRoute} data-mobID={26}/>
					<h2 id="redKrugsLabel" className="mobLabel">Red Krugs!</h2>

					<canvas id="canvas" ref="canvas" width={0} height={0}/>
				</div>

				<button onClick={this.submit}><p>Submit</p></button>
			</div>
		);
	}

}

export default NewJunglePath;