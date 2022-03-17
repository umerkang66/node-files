import axios from 'axios';

// TYPES
export const FETCH_USERS = 'fetch_users';

// ACTION CREATORS
export const fetchUsers = () => async dispatch => {
  const res = await axios.get('https://react-ssr-api.herokuapp.com/users');

  dispatch({ type: FETCH_USERS, payload: res });
};
