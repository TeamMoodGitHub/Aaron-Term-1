import React from 'react';
import PreviewCamp from './previewCamp';

const style = {
	margin: 10,
	width: "30%",
	display: "inline-block",
	"vertical-align": "top"
};

class RoutePreview extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section style={style}> 
				{
					this.props.route.map(
						(camp, position) => <PreviewCamp camp={camp} number={position+1} />
					)
				}
			</section>
		);
	}

}

export default RoutePreview;