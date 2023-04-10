import { type ChangeEventHandler, type FC, useState } from 'react';

import { useSignup } from '../../hooks/auth/use-signup';
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
  const signupMutation = useSignup();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    signupMutation.signup(userInfo);
  };

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
      <Submit value="Sign up" isLoading={signupMutation.isLoading} />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signin">Sign in</CustomLink>
      </div>
    </Form>
  );
};

export { Signup };
