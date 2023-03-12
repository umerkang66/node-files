import { useEffect } from 'react';
import { CurrentUser } from '../types';
import { useRequest } from './common';

function useSignup() {
  type SignupResponseType = { userId: string; message: string };

  const { doRequest, data, loading, errors } = useRequest<SignupResponseType>({
    url: '/api/auth/signup',
    method: 'post',
  });

  type UserInfoForSignup = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  function signup(userInfo: UserInfoForSignup) {
    doRequest(userInfo);
  }

  return { signup, data, loading, errors };
}

function useConfirmSignup() {
  type ConfirmSignupResponseType = {
    id: string;
    name: string;
    email: string;
  };

  const { doRequest, data, loading, errors } =
    useRequest<ConfirmSignupResponseType>({
      url: '/api/auth/confirm-signup',
      method: 'post',
    });

  const confirmSignup = (token: string, userId: string) => {
    doRequest({ token, userId });
  };

  return { confirmSignup, data, loading, errors };
}

function useCurrentUser() {
  type CurrentUserResponse = { currentUser: CurrentUser };

  // 'useCache' only makes sense in queries
  // and 'refetch' also makes sense in queries
  const { doRequest, refetch, data, loading, errors } =
    useRequest<CurrentUserResponse>({
      url: '/api/auth/currentuser',
      useCache: true,
    });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return { data, loading, errors, refetch };
}

export { useSignup, useConfirmSignup, useCurrentUser };
