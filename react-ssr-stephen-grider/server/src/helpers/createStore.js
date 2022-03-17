import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../client/reducers';

// This runs on server
const reduxStore = () => {
  const store = createStore(reducers, {}, applyMiddleware(thunk));

  return store;
};

export default reduxStore;
