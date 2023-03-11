import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Errors } from '../types';

type Method = 'get' | 'post' | 'patch' | 'delete';
type Args = { url: string; method: Method };

function useRequest<Data>(args: Args) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null as Errors | null);
  const [data, setData] = useState<Data | null>(null);

  async function doRequest<Body extends Object>(body?: Body) {
    try {
      setLoading(true);
      const res = await axios[args.method](args.url, body);

      setData(res.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setErrors(err.response.data.errors);
      }

      setLoading(false);
    }
  }

  return [doRequest, data, loading, errors] as const;
}

export { useRequest };
