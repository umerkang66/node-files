import { FC } from 'react';

import { CustomLink } from '../common/custom-link';
import { Title, FormInput, Submit, Form } from '../common/form';

const Signin: FC = () => {
  return (
    <Form className="w-72">
      <Title>Sign in</Title>
      <FormInput label="Email" placeholder="john@email.com" name="email" />
      <FormInput
        label="Password"
        placeholder="********"
        name="password"
        type="password"
      />
      <Submit value="Sign in" />

      <div className="flex justify-between">
        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
        <CustomLink to="/auth/signup">Sign up</CustomLink>
      </div>
    </Form>
  );
};

export { Signin };
