// Startup point for the client side application
// So we can use async await syntax in server
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

// Manually created routes
import Routes from './Routes';
// Reducers
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(thunk));

// Use hydrate instead of render
// We are not replacing the html inside of the 'root' div, but we are just saying to set all the event-handlers to the html content
// This process is know as hydration
ReactDOM.hydrate(
  // Browser will understand BrowserRouter
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(Routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
