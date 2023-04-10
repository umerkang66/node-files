import { FC, useState } from 'react';
import { CustomLink } from '../common/custom-link';
import { Form, FormInput, Submit, Title } from '../common/form';
import { useForgotPassword } from '../../hooks/auth/use-forgot-password';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  return (
    <Form
      className="w-96"
      onSubmit={() => forgotPasswordMutation.forgotPassword({ email })}
    >
      <Title>Please enter your email</Title>
      <FormInput
        label="Email"
        placeholder="john@email.com"
        name="email"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <Submit
        value="Send the reset password link"
        isLoading={forgotPasswordMutation.isLoading}
      />

      <div className="flex justify-between">
        <CustomLink to="/auth/signin">Sign In</CustomLink>
        <CustomLink to="/auth/signup">Sign up</CustomLink>
      </div>
    </Form>
  );
};

export { ForgotPassword };
