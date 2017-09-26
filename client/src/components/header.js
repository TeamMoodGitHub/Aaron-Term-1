import React from 'react';

import Logo from './logo';
import SearchBox from './searchBox';

const style = {
	"background-color": "#eee",
	"padding": "18px 35px",
}

class Header extends React.Component {

	render() {
		return (
			<header style={style}>
				<Logo />
				<SearchBox />
			</header>
			);
	}

}

export default Header;