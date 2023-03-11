import { type ChangeEventHandler, type FC, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/auth';

import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../form';

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

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    signupHook.signup(userInfo);
  };

  useEffect(() => {
    if (signupHook.errors) {
      toast.dismiss();

      signupHook.errors.forEach(err => toast.error(err.message));
    }

    if (signupHook.data && !signupHook.errors) {
      toast.dismiss();

      toast.success(signupHook.data.message);

      navigate('/auth/confirm-signup', {
        state: { userId: signupHook.data.userId },
        // delete the current page from back history
        replace: true,
      });
    }
  }, [navigate, signupHook.data, signupHook.errors]);

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
