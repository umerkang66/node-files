import { combineReducers } from 'redux';

import usersReducer from './usersReducer';
import authReducer from './authReducer';
import adminsReducer from './adminsReducer';

const reducers = combineReducers({
  admins: adminsReducer,
  users: usersReducer,
  auth: authReducer,
});

export default reducers;
