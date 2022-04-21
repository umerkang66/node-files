import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, imageFile, history) => async dispatch => {
  // Get the url string from aws
  const uploadConfig = await axios.get('/api/upload');
  // By using that url string, upload the actual file
  await axios.put(uploadConfig.data.url, imageFile, {
    headers: {
      'Content-Type': imageFile.type,
    },
  });

  const res = await axios.post('/api/blogs', {
    ...values,
    imageUrl: uploadConfig.data.key,
  });
  dispatch({ type: FETCH_BLOG, payload: res.data });

  history.push('/blogs');
};

export const fetchBlogs = () => async dispatch => {
  const res = await axios.get('/api/blogs');
  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);
  dispatch({ type: FETCH_BLOG, payload: res.data });
};
