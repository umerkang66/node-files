import { ChangeEventHandler, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, FormInput, Submit, Title } from '../common/form';
import { useResetPassword } from '../../hooks/auth/use-reset-password';

function ResetPassword() {
  // we can also get the userId from react-router-dom useLocation state
  // but we have also in the url that is sent by server
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const resetPasswordMutation = useResetPassword(token!, userId!);

  const [userInfo, setUserInfo] = useState({
    password: '',
    passwordConfirm: '',
  });
  const { password, passwordConfirm } = userInfo;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form
      className="w-96"
      onSubmit={() =>
        resetPasswordMutation.resetPassword({ password, passwordConfirm })
      }
    >
      <Title>Enter new Password</Title>
      <FormInput
        type="password"
        label="New Password"
        placeholder="********"
        name="password"
        value={password}
        onChange={handleInputChange}
      />
      <FormInput
        type="password"
        label="Password Confirm"
        placeholder="********"
        name="passwordConfirm"
        value={passwordConfirm}
        onChange={handleInputChange}
      />
      <Submit
        value="Reset your password"
        isLoading={resetPasswordMutation.isLoading}
      />
    </Form>
  );
}

export { ResetPassword };
