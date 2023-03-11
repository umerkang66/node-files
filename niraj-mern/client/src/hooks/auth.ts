import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Errors } from '../types';

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as Errors | null);
  const [data, setData] = useState(null as any);

  const signup = async (
    userInfo: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
    },
    callback?: () => void
  ) => {
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/signup', userInfo);

      setLoading(false);
      setData(res.data);
      if (callback) callback();
    } catch (err) {
      setLoading(false);
      if (err instanceof AxiosError) {
        setError(err.response?.data.errors);
      }
    }
  };

  return { data, loading, error, signup };
}
