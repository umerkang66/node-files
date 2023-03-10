import type { FC } from 'react';
import { Container } from '../common/container';
import { CustomLink } from '../common/custom-link';
import { FormInput, Submit, Title } from '../form';

const Signup: FC = () => {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-80 space-y-6 mt-20">
          <Title>Sign up</Title>
          <FormInput label="Name" placeholder="John Doe" name="name" />
          <FormInput label="Email" placeholder="john@email.com" name="email" />
          <FormInput label="Password" placeholder="********" name="password" />
          <FormInput
            label="Password Confirm"
            placeholder="********"
            name="password-confirm"
          />
          <Submit value="Sign up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </div>
  );
};

export { Signup };
