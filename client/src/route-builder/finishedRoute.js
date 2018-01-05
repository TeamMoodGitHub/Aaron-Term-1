import React from 'react';

class FinishedRoute extends React.Component {

	constructor(props) {
		super(props);

		this.doneLoading = this.doneLoading.bind(this);
	}

	doneLoading() {
		this.refs.progress.style.display = "none";
		this.refs.image.style.display="block";
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.routeImage !== this.props.routeImage && this.refs.progress) {
			this.refs.progress.style.display="block";
			this.refs.image.style.display="none";
		}
	}

	render() {
		return (
			<div>
				<h1>Finished Route: { JSON.stringify(this.props.routeImage) }</h1>
				{ 
					this.props.routeImage ? 
					(
						<div>
							<div ref="progress" className="loader" style={{display:"block"}}></div>
							<img ref="image" src={this.props.routeImage} onLoad={this.doneLoading} style={{display:"none", width: "80%", margin: "20px auto"}}/>
						</div>
					) 
					: 
					<img /> 
				}
			</div>
		);
	}
}

export default FinishedRoute;