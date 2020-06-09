import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes = () => {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/create-point' component={CreatePoint} />
			</Switch>
		</Router>
	);
};

export default Routes;
