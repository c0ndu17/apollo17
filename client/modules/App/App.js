import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ApolloClient from 'apollo-client';

import { compose, graphql, withApollo } from 'react-apollo';

// Import Components
import Helmet from 'react-helmet';
import DevTools from '../../components/DevTools/DevTools';
import {
  AppQuery,
  AppMutation
} from './AppSchema';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }


  render() {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="React-Apollo boilerplate"
            titleTemplate="%s"
            meta={[
              { 
                charset: 'utf-8'
              },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
              {
                name: 'robots',
                content: 'noindex',
              },
            ]}
          />
          <div>
						{ this.props.data.testString }
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.shape({
		testString: PropTypes.string,
	}),
};

export default compose(
  graphql(AppQuery, {}),
  graphql(AppMutation, {}),
)(App);

// export default graphql(AppQuery)(App);
