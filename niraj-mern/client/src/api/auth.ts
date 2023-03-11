import axios, { AxiosError } from 'axios';
import type { Errors } from '../types';

type UserInfo = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

async function signup(userInfo: UserInfo): Promise<{
  data: { userId: string; message: string } | null;
  errors: Errors | null;
}> {
  try {
    const { data } = await axios.post('/api/auth/signup', userInfo);

    return { data, errors: null };
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      return {
        data: null,
        errors: err.response.data.errors,
      };
    }
  }

  return { data: null, errors: null };
}

export { signup };
