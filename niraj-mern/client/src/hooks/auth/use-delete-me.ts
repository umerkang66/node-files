import { useCallback } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const deleteMeFn = catchAxiosErrors(async (url: string) => {
  const res = await axios.delete(url);
  return res.data as '';
});

function useDeleteMe() {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.deleteMe,
    deleteMeFn,
    {
      onSuccess(data, key, config) {
        if (data === '') {
          // '' is when user is successfully deleted
          toast.success('Your account is successfully deleted');
          navigate('/');
        }
      },
    }
  );

  const deleteMe = useCallback(async () => {
    await trigger();
    // This will returns a promise
    return mutate(Keys.currentUser);
  }, [trigger]);

  return {
    deleteMe,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useDeleteMe };
