import axios from 'axios';
import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';

import type { Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signupFn = catchErrors(
  async (url: string, { arg }: { arg: any }) => {
    const res = await axios.post(url, arg);
    return res.data as { userId: string; message: string };
  }
);

function useSignup() {
  const { trigger, data, error, isMutating } =
    useSWRMutation(Keys.signup, signupFn);

  type Body = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  const signup = useCallback(
    (body: Body) => trigger(body),
    [trigger]
  );

  return {
    signup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignup };
