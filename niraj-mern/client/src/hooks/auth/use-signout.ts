import { useCallback } from 'react';
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
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signout,
    signoutFn,
    {
      onSuccess(data, key, config) {
        if (data && data.message) {
          toast.success(data.message);
          navigate('/');
        }
      },
    }
  );

  const signout = useCallback(async () => {
    await trigger();
    return mutate(Keys.currentUser);
  }, [trigger]);

  return {
    signout,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignout };
