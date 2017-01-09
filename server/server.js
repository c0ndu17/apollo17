import path from 'path';
import http from 'http';
// import https from 'https';
import fs from 'fs';
import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';

// React And Redux Setup
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';
// import genericRoutes from './routes/generic.routes';
import serverConfig from './config';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
// import { subscriptionManager } from './subscriptions';

import schema from './api/schema';

// Initialize the Express App
const app = new Express();


// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  serverConfig.httpPort = 8000;
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
} 

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use(Express.static(path.resolve(__dirname, 'assets')));
app.use('/graphql',  graphqlExpress((req) => {
   const query = req.query.query || req.body.query;
	 // if (query && query.length > 2000) {
		 // // None of our app's queries are this long
		 // // Probably indicates someone trying to send an overly expensive query
		 // throw new Error('Query too large.');
	 // }
	 return {
		 schema : schema,
		 context: {},
	 };
}));


app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// WebSocket server for subscriptions
// const websocketServer = http.createServer((request, response) => {
//   response.writeHead(404);
//   response.end();
// });

// websocketServer.listen(serverConfig.wsPort, () => console.log( // eslint-disable-line no-console
//   `Websocket Server is now running on http://localhost:${serverConfig.wsPort}`
// ));

// // eslint-disable-next-line
// new SubscriptionServer(
//   {
//     subscriptionManager,

//     // the obSubscribe function is called for every new subscription
//     // and we use it to set the GraphQL context for this subscription
//     onSubscribe: (msg, params) => {
//       return Object.assign({}, params, {
//         context: {
//           // Repositories: new Repositories({ connector: gitHubConnector }),
//           // Users: new Users({ connector: gitHubConnector }),
//           // Entries: new Entries(),
//           // Comments: new Comments(),
//         },
//       });
//     },
//   },
//   websocketServer
// );


// Render Initial HTML
const renderFullPage = (html, initialState, username) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link href='https://bootswatch.com/flatly/bootstrap.min.css' rel='stylesheet' type='text/css'/>
        <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="/img/favicon.png" type="image/png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"/>
        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <script>User = '`+ username +`'</script>
      </head>
      <body style="display: none;">
				<div id="root">${process.env.NODE_ENV === 'production' ? html : `<div>${html}</div>`}</div>

        <script>
          window.__APOLLO_STATE__ = ${JSON.stringify(initialState)};

          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {}, '');
};


// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }
		const client = new ApolloClient({
			ssrMode: true,
			// Remember that this is the interface the SSR server will use to connect to the
			// API server, so we need to ensure it isn't firewalled, etc
			networkInterface: createNetworkInterface({
				uri: 'http://localhost:3010',
				opts: {
					credentials: 'same-origin',
					// transfer request headers to networkInterface so that they're accessible to proxy server
					// Addresses this issue: https://github.com/matthew-andrews/isomorphic-fetch/issues/83
					headers: req.headers,
				},
			}),
		});

		let reactApp = (
			<ApolloProvider client={client} immutable={true}>
					<RouterContext {...renderProps} />
			</ApolloProvider>
		)
    return Promise.resolve()
      .then(() => {
        const initialView = renderToString(reactApp);
				const initialState = {[client.reduxRootKey]: {
					data: client.store.getState()[client.reduxRootKey].data
				}};
				console.log(JSON.stringify(initialState));

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, {}, req.query.user));
      })
      .catch((error) => next(error));
  });
});
            // <IntlWrapper>
            // </IntlWrapper>

// start app
const server = http.createServer(app);
server.listen(serverConfig.httpPort, (error) => {
  if (!error) {
    console.log(`Le Server is running on port: ${serverConfig.httpPort}! Build something amazing!`); // eslint-disable-line
  }
})


export default app;
