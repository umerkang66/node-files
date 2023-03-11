import type { FC } from 'react';
import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../form';

const ForgetPassword: FC = () => {
  return (
    <Form className="w-96">
      <Title>Please enter your email</Title>
      <FormInput label="Email" placeholder="john@email.com" name="email" />
      <Submit value="Send the reset password link" />

      <div className="flex justify-between">
        <CustomLink to="/auth/signin">Sign In</CustomLink>
        <CustomLink to="/auth/signup">Sign up</CustomLink>
      </div>
    </Form>
  );
};

export { ForgetPassword };
