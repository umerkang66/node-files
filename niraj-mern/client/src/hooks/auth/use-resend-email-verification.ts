import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';

import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';
import type { CurrentUser, Errors } from '../../types';

const resendEmailVerificationFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: any }) => {
    const res = await axios.post(url, arg);
    return res.data as CurrentUser;
  }
);

function useResendEmailVerification() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.resendEmailVerification,
    resendEmailVerificationFn,
    { onSuccess: () => toast.success('Email verification token is sent') }
  );

  type Body = { userId: string };

  const resendEmailVerification = useCallback(
    (body: Body) => trigger(body),
    [trigger]
  );

  return {
    resendEmailVerification,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useResendEmailVerification };
