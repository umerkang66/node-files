import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { Errors } from '../types';

type Method = 'get' | 'post' | 'patch' | 'delete';
type Args = { url: string; method?: Method; useCache?: boolean };

const requestCache: { data: null | any } = { data: null };

function useRequest<Data>({ method = 'get', url, useCache = false }: Args) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null as Errors | null);
  const [data, setData] = useState<Data | null>(
    useCache && requestCache.data ? requestCache.data : null
  );

  const requestFn = useCallback(
    async <Body extends Object>(body?: Body): Promise<void> => {
      try {
        setLoading(true);
        setErrors(null);

        const res = await axios[method](url, body);
        if (useCache) {
          requestCache.data = res.data;
        }

        setData(res.data);
        setLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          setErrors(err.response.data.errors);
        }

        setLoading(false);
      }
    },
    [method, url, useCache]
  );

  const doRequest = useCallback(
    <Body extends Object>(body?: Body) => {
      if (useCache && requestCache.data) {
        // data is already been set to the at the start of useState
        return;
      }
      requestFn();
    },
    [requestFn, useCache]
  );

  return { doRequest, refetch: requestFn, data, loading, errors };
}

export { useRequest };
