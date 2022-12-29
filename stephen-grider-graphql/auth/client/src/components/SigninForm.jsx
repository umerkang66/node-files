import { useMutation } from '@apollo/client';

import AuthForm from './AuthForm';
import { signinMutation } from '../mutations';
import { currentUserQuery } from '../queries';

import { useAfterAuth } from '../hooks';

const SigninForm = () => {
  const [signIn, { data, loading, error }] = useMutation(signinMutation);

  useAfterAuth();

  function signinHandler(email, password) {
    signIn({
      variables: { email, password },
      refetchQueries: [{ query: currentUserQuery }],
    });
  }

  return (
    <>
      <AuthForm
        title="Signin"
        onSubmit={signinHandler}
        loading={loading}
        reset={data && data.login.id}
      />

      {error && (
        <div className="error">
          {'Err: ' + error.message.split(':')[1].replaceAll('"', '')}
        </div>
      )}
    </>
  );
};

export default SigninForm;
