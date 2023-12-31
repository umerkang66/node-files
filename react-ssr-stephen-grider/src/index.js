// So we can use async await syntax in server
import 'babel-polyfill';

// We can use es2015 modules system also on the server because server code is also handled by webpack
// These LIBRARIES will not be included in final bundle.js file, because we don't need it, in fact we need it in the client. We just need it here to create the string
// These functions will be included but not all the libraries
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';

import renderer from './helpers/renderer';
import reduxStore from './helpers/createStore';
import Routes from './client/Routes';

// We have to run webpack on this "node index.js" file, that will create a bundle.js file that we have to run through node bundle.js, this bundle file will create html string out of react components only fly
const app = express();

// If request comes to '/api', send the request to
app.use(
  '/api',
  proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
      opts.headers['x-forwarded-host'] = 'localhost:3000';
      return opts;
    },
  })
);

app.use(express.static('public'));

// Send root Routes
// Express will not handle any routing, all the routing will be handled by react-router that will be delegated to react-router from express
app.get('*', (req, res) => {
  // Data fetching should be done before rendering the html page, so here first data fetching will be done, then pass along to the renderer function (that will create html data according to this data)
  const store = reduxStore(req);

  // Fetch some data and pass into the store
  // This will return the list of components that will be rendered through req.path
  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      // Pass the store into load data, where they can manually dispatch an action
      return route.loadData ? route.loadData(store) : null;
    })
    .map(promise => {
      // Check for the null value
      if (promise) {
        return new Promise((resolve, reject) => {
          // No matter if promise resolve or reject, we will always resolve it
          promise.then(resolve).catch(resolve);
        });
      }
    });

  const render = () => {
    const context = {};
    // Pass req to renderer because StaticRouter needs to know path user is currently accessing
    const content = renderer(req, store, context);
    if (context.notFound) res.status(404);

    // When we redirect the page using Redirect react-router component, in the StaticRouter, it will set the property on the context obj, where we can access it and redirect manually
    if (context.url) {
      return res.redirect(301, context.url);
    }

    res.send(content);
  };

  // Render the content once loadData has resolved or even rejected
  Promise.all(promises).then(render).catch(render);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
