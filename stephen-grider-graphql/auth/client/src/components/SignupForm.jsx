import { useMutation } from '@apollo/client';
import AuthForm from './AuthForm';
import { signupMutation } from '../mutations';
import { currentUserQuery } from '../queries';

import { useAfterAuth } from '../hooks';

const SignupForm = () => {
  const [signup, { data, loading, error }] = useMutation(signupMutation);

  useAfterAuth();

  const signupHandler = (email, password) => {
    signup({
      variables: { email, password },
      refetchQueries: [{ query: currentUserQuery }],
    });
  };

  return (
    <div>
      <AuthForm
        title="Signup"
        onSubmit={signupHandler}
        loading={loading}
        reset={data && data.signup.id}
      />

      {error && error.message && (
        <div className="error">{'Err: ' + error.message}</div>
      )}
    </div>
  );
};

export default SignupForm;
