import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Keys } from '../keys';
import { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';

const forgotPasswordFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: { email: string } }) => {
    const res = await axios.post(url, arg);
    return res.data as { userId: string; message: string };
  }
);

function useForgotPassword() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.forgotPassword,
    forgotPasswordFn,
    {
      onSuccess(data, key, config) {
        // see the use signup hook, to know how to share state between routes
        if (data) toast.success(data.message);
      },
    }
  );

  type Body = { email: string };
  const forgotPassword = useCallback((body: Body) => trigger(body), [trigger]);

  return {
    forgotPassword,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useForgotPassword };
