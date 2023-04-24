import axios from 'axios';
import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';

import type { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

type Body = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const adminSignupFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: Body }) => {
    type AdminSignupReturnType = { message: string };

    const res = await axios.post(url, arg);
    return res.data as AdminSignupReturnType;
  }
);

function useAdminSignup() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.adminSignup,
    adminSignupFn,
    {
      onSuccess(data, key, config) {
        if (data) toast.success(data.message);
      },
    }
  );

  const adminSignup = useCallback((body: Body) => trigger(body), [trigger]);

  return {
    adminSignup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useAdminSignup };
