import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Keys } from '../keys';
import { CurrentUser, Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { mutate } from 'swr';

const resetPasswordFn = catchAxiosErrors(
  async (
    url: string,
    { arg }: { arg: { password: string; passwordConfirm: string } }
  ) => {
    const res = await axios.patch(url, arg);
    return res.data as
      | CurrentUser
      | { isVerified: false; message: string; userId: string };
  }
);

function useResetPassword(token: string, userId: string) {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.resetPassword(token, userId),
    resetPasswordFn,
    {
      onSuccess(data, key, config) {
        if (data) {
          if (data.isVerified === false) {
            toast.warn('You are not verified, please verify your account');
            navigate('/auth/confirm-signup', {
              state: { userId: data.userId },
              // delete the current page from back history
              replace: true,
            });
          } else {
            toast.success('You have successfully reset the password');
            navigate('/');
          }
        }
      },
    }
  );

  type Body = { password: string; passwordConfirm: string };
  const resetPassword = useCallback(
    async (body: Body) => {
      await trigger(body);
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  return {
    resetPassword,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useResetPassword };
