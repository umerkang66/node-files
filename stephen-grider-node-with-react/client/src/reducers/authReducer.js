import { FETCH_USER } from '../actions/actionTypes';

// This state is the current state of this reducer, now the whole state of redux store, means we don't have to select the auth state from redux store, but this is automatically an auth state

// If the user exists
const authReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    default:
      return state;
  }
};

export default authReducer;
