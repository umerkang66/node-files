import { useRequest } from './common';

function useSignup() {
  type SignupResponseType = { userId: string; message: string };

  const [doRequest, data, loading, errors] = useRequest<SignupResponseType>({
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

  const [doRequest, data, loading, errors] =
    useRequest<ConfirmSignupResponseType>({
      url: '/api/auth/confirm-signup',
      method: 'post',
    });

  const confirmSignup = (token: string, userId: string) => {
    doRequest({ token, userId });
  };

  return { confirmSignup, data, loading, errors };
}

export { useSignup, useConfirmSignup };
