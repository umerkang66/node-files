import { FETCH_CURRENT_USER } from '../actions';

const authReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER:
      // If authenticated, return user data, otherwise return false
      return action.payload.data || false;
    default:
      return state;
  }
};

export default authReducer;
