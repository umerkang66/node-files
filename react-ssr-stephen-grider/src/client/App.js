import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import { fetchCurrentUser } from './actions';

// Components
import Header from './components/Header';

// App component has some nested routes, that is passed into this component as route property, then render them using renderRoutes()
const App = ({ route }) => {
  return (
    <div>
      <Header />
      {renderRoutes(route.routes)}
    </div>
  );
};

// This will load the data and pass the initial state on the client side store through html (see the renderer)
function loadData(store) {
  return store.dispatch(fetchCurrentUser());
}

export default {
  component: App,
  loadData,
};
