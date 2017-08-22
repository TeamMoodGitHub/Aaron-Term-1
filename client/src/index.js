import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';

import history from './history';

import './style.css';

//import './index.css'

ReactDOM.render(
	<Routes history={history} />, 
	document.getElementById("root")
	);
