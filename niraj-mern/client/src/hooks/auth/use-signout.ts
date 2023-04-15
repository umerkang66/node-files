import { useCallback, useEffect, useRef } from 'react';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Keys } from '../keys';
import { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';

const signoutFn = catchAxiosErrors(async (url: string) => {
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
    if (data && data.message) {
      toast.success(data.message);
      navigate.current('/');
    }
    // navigate will not create a problem, because this component
    // and hooks will unmount, when the path changes,
    // problem will occur in navbar hooks, because that will
    // not be unmount, because navbar stays forever
    // here we have to memoize the navigate
  }, [data, navigate]);

  return {
    signout,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignout };
