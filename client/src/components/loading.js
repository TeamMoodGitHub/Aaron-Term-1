import React from 'react';

import '../font-awesome/css/font-awesome.min.css';

const style = {
	position: "absolute",
	margin: "auto",
	width: "100%",
	"margin-top": "21%",
	"text-align": "center"
};

class Loading extends React.Component {

	render() {

		if (this.props.positioned) {
			return (
			<div className="loading">
				<i style={{margin: 10}}className = "fa fa-3x fa-spinner fa-pulse fa-fw" />
			</div>
			);
		}

		return (
			<div style={style} className="loading">
				<i className = "fa fa-5x fa-spinner fa-pulse fa-fw" />
			</div>
			);
	}

}

export default Loading;