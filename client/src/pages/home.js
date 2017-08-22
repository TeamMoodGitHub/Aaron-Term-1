import React from 'react';

import Logo from '../components/logo';
import SearchBox from '../components/searchBox'

const Home = (props) => (
	<div className="home">
		<Logo size="large"/>
		<SearchBox size="large" />
	</div>
);

export default Home;