import React from 'react';

import Logo from '../components/logo';
import SearchBox from '../components/searchBox'

const style = {
	margin: "auto",
	position: "absolute",
	top: 0, left: 0, bottom: 0, right: 0,
	height: 300,
	"@media (max-width: 540px)": {
		height: 235
	}
};

const Home = (props) => (
	<div className="home" style={style}>
		<Logo size="large"/>
		<SearchBox size="large" />
	</div>
);

export default Home;