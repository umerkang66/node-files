import type { FC } from 'react';
import { Container } from '../common/container';
import { CustomLink } from '../common/custom-link';
import { FormInput, Submit, Title } from '../form';

const ForgetPassword: FC = () => {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-96 space-y-6">
          <Title>Please enter your email</Title>
          <FormInput label="Email" placeholder="john@email.com" name="email" />
          <Submit value="Send the reset password link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign In</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default ForgetPassword;
