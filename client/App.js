/**
 * Root Component
 */
import React from 'react';
import { Router, browserHistory } from 'react-router';

// Import Routes
import routes from './routes';

// Base stylesheet
require('./app.scss');


export default function App(props) {
  return (
    <Router history={browserHistory}>
      {routes}
    </Router>
  );
}

App.propTypes = {
};

