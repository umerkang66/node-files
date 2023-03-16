import { useCallback } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';

import { CurrentUser, Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const signinFn = catchErrors(
  async (url: string, { arg }: { arg: any }) => {
    const res = await axios.post(url, arg);
    return res.data as CurrentUser;
  }
);

function useSignin() {
  const { trigger, data, error, isMutating } =
    useSWRMutation(Keys.signin, signinFn);

  const signin = useCallback(
    async (body: { email: string; password: string }) => {
      await trigger(body);
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
