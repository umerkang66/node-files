import axios from 'axios';
import { useCallback } from 'react';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';

import type { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';
import { useNavigate } from 'react-router-dom';

const confirmAdminSignupFn = catchAxiosErrors(async (url: string) => {
  type ConfirmAdminSignupReturnType = { message: string };

  const res = await axios.patch(url);
  return res.data as ConfirmAdminSignupReturnType;
});

function useConfirmAdminSignup(userId: string, token: string) {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.confirmAdminSignup(userId, token),
    confirmAdminSignupFn,
    {
      onSuccess(data, key, config) {
        if (data) toast.success(data.message);
        navigate('/');
      },
    }
  );

  const confirmAdminSignup = useCallback(async () => {
    await trigger();
    return mutate(Keys.currentUser);
  }, [trigger]);

  return {
    confirmAdminSignup,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useConfirmAdminSignup };
