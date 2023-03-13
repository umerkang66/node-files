import axios from 'axios';
import useSWR from 'swr';

import { CurrentUser } from '../../types';
import { Keys } from '../keys';

const fetchUser = async (url: string) => {
  const res = await axios.get(url);
  return res.data as { currentUser: CurrentUser };
};

function useUser() {
  const { data, error, isLoading } = useSWR(Keys.currentUser, fetchUser);

  return {
    data,
    isLoading,
    error,
  };
}

export { useUser };
