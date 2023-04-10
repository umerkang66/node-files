import { useCallback, useEffect } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { CurrentUser, Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signinFn = catchErrors(async (url: string, { arg }: { arg: any }) => {
  type SigninReturnType =
    | CurrentUser
    | {
        message: string;
        userId: string;
        isVerified: false;
      };

  const res = await axios.post(url, arg);
  return res.data as SigninReturnType;
});

function useSignin() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signin,
    signinFn
  );
  const navigate = useNavigate();

  const signin = useCallback(
    async (body: { email: string; password: string }) => {
      await trigger(body);
      // This will returns a promise
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  useEffect(() => {
    // error is handled globally
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
  }, [data, navigate]);

  return {
    signin,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignin };
