import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';

import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';
import type { CurrentUser, Errors } from '../../types';

const confirmSignupFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: any }) => {
    const res = await axios.post(url, arg);
    return res.data as CurrentUser;
  }
);

function useConfirmSignup() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.confirmSignup,
    confirmSignupFn,
    {
      onSuccess(data, key, config) {
        if (data) toast.success('You account is successfully verified');
      },
    }
  );

  type Body = { token: string; userId: string };

  const confirmSignup = useCallback(
    async (body: Body) => {
      await trigger(body);
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  return {
    confirmSignup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useConfirmSignup };
