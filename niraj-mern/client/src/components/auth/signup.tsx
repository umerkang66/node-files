import { type ChangeEventHandler, type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../context/notification-provider';
import { useSignup } from '../../hooks/auth';

import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../common/form';

const Signup: FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } = userInfo;
  const navigate = useNavigate();
  const signupHook = useSignup();
  const { updateNotifications, clearPreviousNotifications } =
    useNotificationContext();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    signupHook.signup(userInfo);
  };

  useEffect(() => {
    clearPreviousNotifications();

    if (signupHook.errors) {
      signupHook.errors.forEach(err =>
        updateNotifications({ text: err.message, status: 'error' })
      );
    }

    if (signupHook.data && !signupHook.errors) {
      updateNotifications({ text: signupHook.data.message, status: 'success' });

      navigate('/auth/confirm-signup', {
        state: { userId: signupHook.data.userId },
        // delete the current page from back history
        replace: true,
      });
    }
  }, [
    clearPreviousNotifications,
    updateNotifications,
    navigate,
    signupHook.data,
    signupHook.errors,
  ]);

  return (
    <Form className="w-80 mt-20" onSubmit={handleSubmit}>
      <Title>Sign up</Title>
      <FormInput
        label="Name"
        placeholder="John Doe"
        name="name"
        value={name}
        onChange={handleInputChange}
      />
      <FormInput
        label="Email"
        placeholder="john@email.com"
        name="email"
        value={email}
        onChange={handleInputChange}
      />
      <FormInput
        type="password"
        label="Password"
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
      <Submit value="Sign up" isLoading={signupHook.loading} />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signin">Sign in</CustomLink>
      </div>
    </Form>
  );
};

export { Signup };
