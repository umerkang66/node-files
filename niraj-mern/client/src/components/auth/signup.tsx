import { type ChangeEventHandler, type FC, useState } from 'react';

import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../form';
import { useSignup } from '../../hooks/auth';

const Signup: FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } = userInfo;

  const { data, loading, signup } = useSignup();

  console.log(data);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form className="w-80" onSubmit={() => signup(userInfo)}>
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
      <Submit value="Sign up" isLoading={loading} />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signin">Sign in</CustomLink>
      </div>
    </Form>
  );
};

export { Signup };
