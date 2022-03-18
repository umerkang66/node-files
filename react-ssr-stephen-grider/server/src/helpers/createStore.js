import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from '../client/reducers';

// This runs on server
const reduxStore = req => {
  const axiosInstance = axios.create({
    baseURL: 'http://react-ssr-api.herokuapp.com',
    headers: {
      // Get the cookie from the request, and set it to custom cookie
      cookie: req.get('cookie') || '',
    },
  });

  const store = createStore(
    reducers,
    {},
    // This extra argument will be add as the third argument to the thunk actions, after dispatch, and getState
    applyMiddleware(thunk.withExtraArgument(axiosInstance))
  );

  return store;
};

export default reduxStore;
