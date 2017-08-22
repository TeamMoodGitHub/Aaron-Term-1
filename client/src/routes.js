import React from 'react';
import {Router,  Route, Switch} from 'react-router';

import Home from './pages/home';
import Champion from './pages/champion';
import NotFound from './pages/notFound';

const Routes = (props) => (
	<Router {...props}>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/champion/:championName?" component={Champion} />
			<Route path="*" component={NotFound} />
		</Switch>
	</Router>
	)

export default Routes;