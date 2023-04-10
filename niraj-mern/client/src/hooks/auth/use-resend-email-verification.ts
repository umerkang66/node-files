import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import axios from 'axios';

import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';
import type { CurrentUser, Errors } from '../../types';
import { toast } from 'react-toastify';

const resendEmailVerificationFn = catchErrors(
  async (url: string, { arg }: { arg: any }) => {
    const res = await axios.post(url, arg);
    return res.data as CurrentUser;
  }
);

function useResendEmailVerification() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.resendEmailVerification,
    resendEmailVerificationFn
  );

  type Body = { userId: string };

  const resendEmailVerification = useCallback(
    async (body: Body) => {
      await trigger(body);
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  useEffect(() => {
    // error is handled globally
    if (data && !error) {
      toast.success('Email verification token is sent');
    }
  }, [data, error]);

  return {
    resendEmailVerification,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useResendEmailVerification };
