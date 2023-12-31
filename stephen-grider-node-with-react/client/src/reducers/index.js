import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

const reducers = combineReducers({
  form: formReducer,
  auth: authReducer,
  surveys: surveysReducer,
});

export default reducers;
