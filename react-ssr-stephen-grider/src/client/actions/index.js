// TYPES
export const FETCH_USERS = 'fetch_users';
export const FETCH_CURRENT_USER = 'fetch_current_user';
export const FETCH_ADMINS = 'fetch_admins';

// ACTION CREATORS
// axiosInstance is customize with appended url "/api" (for client) and "http://react-ssr-api.herokuapp.com", thus here the whole url becomes "/api/users" (for client) and "http://react-ssr-api.herokuapp.com/users" (for server)

// axiosInstance comes from client.js file (for client), and for server it comes from

export const fetchUsers = () => async (dispatch, getState, axiosInstance) => {
  const res = await axiosInstance.get('/users');
  dispatch({ type: FETCH_USERS, payload: res });
};

export const fetchCurrentUser = () => {
  return async (dispatch, getState, axiosInstance) => {
    const res = await axiosInstance.get('/current_user');

    dispatch({ type: FETCH_CURRENT_USER, payload: res });
  };
};

export const fetchAdmins = () => {
  return async (dispatch, getState, axiosInstance) => {
    const res = await axiosInstance.get('/admins');
    dispatch({ type: FETCH_ADMINS, payload: res });
  };
};
