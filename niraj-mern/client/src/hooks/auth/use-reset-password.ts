import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Keys } from '../keys';
import { CurrentUser, Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { mutate } from 'swr';

const resetPasswordFn = catchErrors(
  async (
    url: string,
    { arg }: { arg: { password: string; passwordConfirm: string } }
  ) => {
    const res = await axios.patch(url, arg);
    return res.data as CurrentUser;
  }
);

function useResetPassword(token: string, userId: string) {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.resetPassword(token, userId),
    resetPasswordFn
  );
  const navigate = useNavigate();

  type Body = { password: string; passwordConfirm: string };
  const resetPassword = useCallback(
    async (body: Body) => {
      await trigger(body);
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  useEffect(() => {
    // error is handled globally
    if (data) {
      toast.success('You have successfully reset the password');
      navigate('/');
    }
    // navigate will not create a problem, because this component
    // and hooks will unmount, when the path changes,
    // problem will occur in navbar hooks, because that will
    // not be unmount, because navbar stays forever
    // here we have to memoize the navigate
  }, [data, navigate]);

  return {
    resetPassword,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useResetPassword };
