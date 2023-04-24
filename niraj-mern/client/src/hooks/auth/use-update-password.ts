import { useCallback } from 'react';
import axios from 'axios';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { CurrentUser, Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

type Body = {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
};

const updatePasswordFn = catchAxiosErrors(
  async (url: string, { arg }: { arg: Body }) => {
    type UpdatePasswordReturnType =
      | CurrentUser
      | {
          message: string;
          userId: string;
          isVerified: false;
        };

    const res = await axios.patch(url, arg);
    return res.data as UpdatePasswordReturnType;
  }
);

function useUpdatePassword() {
  const navigate = useNavigate();

  const { trigger, data, error, isMutating } = useSWRMutation(
    Keys.updatePassword,
    updatePasswordFn,
    {
      onSuccess(data, key, config) {
        if (data) {
          // NOTE: btw, we are checking for the non-verified accounts just as a precautionary measure, because this component will not be show
          if (data.isVerified === false) {
            toast.warn('You are not verified, please verify your account');
            navigate('/auth/confirm-signup', {
              state: { userId: data.userId },
              // delete the current page from back history
              replace: true,
            });
          } else {
            toast.success('You have successfully update your password');
          }
        }
      },
    }
  );

  const updatePassword = useCallback(
    async (body: Body) => {
      await trigger(body);
      // This will returns a promise
      return mutate(Keys.currentUser);
    },
    [trigger]
  );

  return {
    updatePassword,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useUpdatePassword };
