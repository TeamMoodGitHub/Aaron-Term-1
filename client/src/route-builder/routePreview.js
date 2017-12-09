import React from 'react';
import PreviewCamp from './previewCamp';

const style = {
	margin: 10,
	width: "30%",
	height: 700,
	display: "inline-block",
	"vertical-align": "top",
	overflow: "scroll"
};

class RoutePreview extends React.Component {

	constructor(props) {
		super(props);

		this.scrollToBottom = this.scrollToBottom.bind(this);
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom() {
  		const scrollBox = this.refs.scrollWindow;
  		scrollBox.scrollTop = scrollBox.offsetHeight;
	}

	render() {
		return (
			<section style={style} ref="scrollWindow"> 
				{
					this.props.route.map(
						(camp, position) => <PreviewCamp camp={camp} smite={this.props.smites[position]} number={position+1}  deleteFunction={this.props.deleteFunction} />
					)
				}
			</section>
		);
	}

}

export default RoutePreview;