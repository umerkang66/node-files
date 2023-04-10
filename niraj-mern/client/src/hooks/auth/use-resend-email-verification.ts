import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';

import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';
import type { CurrentUser, Errors } from '../../types';

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
    (body: Body) => trigger(body),
    [trigger]
  );

  useEffect(() => {
    // error is handled globally
    if (data) {
      toast.success('Email verification token is sent');
    }
  }, [data]);

  return {
    resendEmailVerification,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useResendEmailVerification };
