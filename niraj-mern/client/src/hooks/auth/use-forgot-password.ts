import { useCallback, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Keys } from '../keys';
import { Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';

const forgotPasswordFn = catchErrors(
  async (url: string, { arg }: { arg: { email: string } }) => {
    const res = await axios.post(url, arg);
    return res.data as { userId: string; message: string };
  }
);

function useForgotPassword() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.forgotPassword,
    forgotPasswordFn
  );

  type Body = { email: string };
  const forgotPassword = useCallback((body: Body) => trigger(body), [trigger]);

  useEffect(() => {
    // error is handled globally
    if (data) {
      // see the use signup hook, to know how to share state between routes
      toast.success(data.message);
    }
    // navigate will not create a problem, because this component
    // and hooks will unmount, when the path changes,
    // problem will occur in navbar hooks, because that will
    // not be unmount, because navbar stays forever
    // here we have to memoize the navigate
  }, [data]);

  return {
    forgotPassword,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useForgotPassword };
