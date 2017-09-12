import React from 'react';

import Logo from './logo';
import SearchBox from './searchBox';

class Header extends React.Component {

	render() {
		return (
			<header>
				<Logo />
				<SearchBox />
			</header>
			);
	}

}

export default Header;