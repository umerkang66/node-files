import { useCallback } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { CurrentUser, Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const updateMeFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: { name: string } }) => {
    type UpdateMeReturnType = CurrentUser;

    const res = await axios.patch(url, arg);
    return res.data as UpdateMeReturnType;
  }
);

function useUpdateMe() {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.updateMe,
    updateMeFn,
    {
      onSuccess(data, key, config) {
        if (data) {
          toast.success('You have successfully update your info');
          navigate('/');
        }
      },
    }
  );

  const updateMe = useCallback(
    async (body: { name: string }) => {
      // This will returns a promise
      await trigger(body);
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  return {
    updateMe,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useUpdateMe };
