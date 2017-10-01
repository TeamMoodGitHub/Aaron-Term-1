import React from 'react';
import Radium from 'radium';

import Camp from './camp';

class JungleRoute extends React.Component {

	render() {
		return (
			<div style={{display: "inline-block", width: "90%", "@media (max-width: 540px)": {"margin-bottom": 40}}} className="jungleRoute">
				{this.props.route.map((camp, index) => <Camp camp={camp} drawArrow={index>0}/>)}
			</div>
		);
	}

}

export default Radium(JungleRoute);