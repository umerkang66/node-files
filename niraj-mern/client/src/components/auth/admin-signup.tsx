import { type ChangeEventHandler, type FC, useState } from 'react';

import { useAdminSignup } from '../../hooks/auth/use-admin-signup';
import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../common/form';

const AdminSignup: FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } = userInfo;
  const adminSignupMutation = useAdminSignup();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    adminSignupMutation.adminSignup(userInfo);
  };

  return (
    <Form className="w-80 mt-20" onSubmit={handleSubmit}>
      <Title>Sign up as Admin</Title>
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
      <Submit value="Sign up" isLoading={adminSignupMutation.isLoading} />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signin">Sign in</CustomLink>
      </div>
    </Form>
  );
};

export { AdminSignup };
