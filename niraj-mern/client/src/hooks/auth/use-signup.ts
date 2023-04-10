import axios from 'axios';
import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import type { Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signupFn = catchErrors(async (url: string, { arg }: { arg: any }) => {
  type SignupReturnType = {
    userId: string;
    message: string;
    isVerified: false;
  };

  const res = await axios.post(url, arg);
  return res.data as SignupReturnType;
});

function useSignup() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.signup,
    signupFn
  );
  const navigate = useNavigate();

  type Body = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  const signup = useCallback((body: Body) => trigger(body), [trigger]);

  useEffect(() => {
    // error is handled globally
    if (data) {
      toast.success(data.message);
      navigate('/auth/confirm-signup', {
        state: { userId: data.userId },
        // delete the current page from back history
        replace: true,
      });
    }
    // navigate will not create a problem, because this component
    // and hooks will unmount, when the path changes,
    // problem will occur in navbar hooks, because that will
    // not be unmount, because navbar stays forever
  }, [navigate, data]);

  return {
    signup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignup };
