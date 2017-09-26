import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import {StyleRoot} from 'radium';

import history from './history';

import './style.css';

//import './index.css'

ReactDOM.render(
	(
		<StyleRoot>
			<Routes history={history} />
		</StyleRoot>
	), 
	document.getElementById("root")
	);
