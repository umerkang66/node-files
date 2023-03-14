import axios from 'axios';
import useSWR from 'swr';

import { CurrentUser, Errors } from '../../types';
import { catchErrors } from '../../utils/catch-errors';
import { Keys } from '../keys';

const fetchUser = catchErrors(async (url: string) => {
  const res = await axios.get(url);
  return res.data as { currentUser: CurrentUser };
});

function useUser() {
  const { data, error, isLoading } = useSWR(
    Keys.currentUser,
    fetchUser
  );

  return {
    data,
    isLoading,
    error: error as Errors | null,
  };
}

export { useUser };
