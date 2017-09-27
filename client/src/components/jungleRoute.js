import React from 'react';
import Camp from './camp';

class JungleRoute extends React.Component {

	render() {
		return (
			<div style={{display: "inline-block"}} className="jungleRoute">
				{this.props.route.map((camp, index) => <Camp camp={camp} drawArrow={index>0}/>)}
			</div>
		);
	}

}

export default JungleRoute;