import React from 'react';

import Logo from './logo';
import SearchBox from './searchBox';

class Header extends React.Component {

	render() {
		return (
			<div className="header">
				<Logo />
				<SearchBox />
			</div>
			);
	}

}

export default Header;