import { ChangeEventHandler, FC, useState } from 'react';

import { useSignin } from '../../hooks/auth/use-signin';
import { CustomLink } from '../common/custom-link';
import { Title, FormInput, Submit, Form } from '../common/form';

const Signin: FC = () => {
  const [signinInfo, setSigninInfo] = useState({
    email: '',
    password: '',
  });
  const signinMutation = useSignin();

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { name, value } = e.target;
    setSigninInfo(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    signinMutation.signin(signinInfo);
  };

  return (
    <Form className="w-72" onSubmit={onSubmit}>
      <Title>Sign in</Title>
      <FormInput
        label="Email"
        placeholder="john@email.com"
        name="email"
        onChange={onChange}
      />
      <FormInput
        label="Password"
        placeholder="********"
        name="password"
        type="password"
        onChange={onChange}
      />
      <Submit value="Sign in" isLoading={signinMutation.isLoading} />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signup">Sign up</CustomLink>
      </div>
    </Form>
  );
};

export { Signin };
