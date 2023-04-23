import { useCallback } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { CurrentUser, Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signinFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: any }) => {
    type SigninReturnType =
      | CurrentUser
      | {
          message: string;
          userId: string;
          isVerified: false;
        };

    const res = await axios.post(url, arg);
    return res.data as SigninReturnType;
  }
);

function useSignin() {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signin,
    signinFn,
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
            toast.success('You are successfully logged in');
            navigate('/');
          }
        }
      },
    }
  );

  const signin = useCallback(
    async (body: { email: string; password: string }) => {
      await trigger(body);
      // This will returns a promise
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  return {
    signin,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignin };
