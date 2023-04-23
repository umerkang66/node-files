import axios from 'axios';
import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import type { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signupFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: any }) => {
    type SignupReturnType = {
      userId: string;
      message: string;
      isVerified: false;
    };

    const res = await axios.post(url, arg);
    return res.data as SignupReturnType;
  }
);

function useSignup() {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signup,
    signupFn,
    {
      onSuccess(data, key, config) {
        if (data) {
          toast.success(data.message);
          navigate('/auth/confirm-signup', {
            state: { userId: data.userId },
            // delete the current page from back history
            replace: true,
          });
        }
      },
    }
  );

  type Body = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  const signup = useCallback((body: Body) => trigger(body), [trigger]);

  return {
    signup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignup };
