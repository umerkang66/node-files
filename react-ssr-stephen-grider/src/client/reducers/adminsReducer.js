import { FETCH_ADMINS } from '../actions';

const adminsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_ADMINS:
      return action.payload.data;
    default:
      return state;
  }
};

export default adminsReducer;
