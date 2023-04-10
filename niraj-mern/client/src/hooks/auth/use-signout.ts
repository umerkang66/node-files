import { useCallback, useEffect, useRef } from 'react';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Keys } from '../keys';
import { Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';

const signoutFn = catchErrors(async (url: string) => {
  const res = await axios.post(url);
  return res.data as { message: string };
});

function useSignout() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signout,
    signoutFn
  );
  const _navigate = useNavigate();
  const navigate = useRef(_navigate);

  const signout = useCallback(async () => {
    await trigger();
    return mutate(Keys.currentUser);
  }, [trigger]);

  useEffect(() => {
    // error is handled globally
    if (data && !error) toast.success(data.message);
    if (data && data.message) navigate.current('/');
    // navigate will not create a problem, because this component
    // and hooks will unmount, when the path changes,
    // problem will occur in navbar hooks, because that will
    // not be unmount, because navbar stays forever
    // here we have to memoize the navigate
  }, [data, error, navigate]);

  return {
    signout,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignout };
