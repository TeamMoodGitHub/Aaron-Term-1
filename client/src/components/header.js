import React from 'react';

import Logo from './logo';
import SearchBox from './searchBox';

const style = {
	"background-color": "#1B5E20",
	"padding": "18px 35px",
	color: "white"
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