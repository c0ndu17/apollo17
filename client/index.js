/**
 * Client entry point
 */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

document.querySelector('body').style['display'] = null;

// Initialize store
const mountApp = document.getElementById('root');
const client = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
});
console.log(client);

render(
  <AppContainer>
    <ApolloProvider client={client}>
			<App />
    </ApolloProvider>
  </AppContainer>,
  mountApp
);

// For hot reloading of react components
if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./App').default; // eslint-disable-line global-require
    render(
      <AppContainer>
				<ApolloProvider client={client}>
					<NextApp />
				</ApolloProvider>
      </AppContainer>,
      mountApp
    );
  });
}

