import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './actionTypes';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  // api will return the user models and that will have the updated credits
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey =
  (values, history, setSubmitBtnValue) => async dispatch => {
    setSubmitBtnValue('Processing...');

    const res = await axios.post('/api/surveys', values);

    setSubmitBtnValue('Send Survey');
    // api will return the user models and that will have the updated credits
    dispatch({ type: FETCH_USER, payload: res.data });
    history.push('/surveys');
  };

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
