import { useCallback } from 'react';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

import { Keys } from '../keys';
import { Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';

const signoutFn = catchErrors(async (url: string) => {
  const res = await axios.post(url);
  return res.data as { message: string };
});

function useSignout() {
  const { trigger, data, error, isMutating } =
    useSWRMutation(Keys.signout, signoutFn);

  const signout = useCallback(async () => {
    await trigger();
    return mutate(Keys.currentUser);
  }, [trigger]);

  return {
    signout,
    data,
    error: error as Errors | null,
    isLoading: isMutating,
  };
}

export { useSignout };
