import axios from 'axios';
import useSWR from 'swr';

import { CurrentUser, Errors } from '../../types';
import { catchAxiosErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const fetchUser = catchAxiosErrors(async (url: string) => {
  const res = await axios.get(url);
  return res.data as { currentUser: CurrentUser };
});

function useUser() {
  // error is handled globally
  const { data, error, isLoading } = useSWR(Keys.currentUser, fetchUser);

  return {
    data,
    isLoading,
    error: error as Errors | null,
  };
}

export { useUser };
