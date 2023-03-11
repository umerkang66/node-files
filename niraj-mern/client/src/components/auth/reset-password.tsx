import { Form, FormInput, Submit, Title } from '../form';

function ResetPassword() {
  return (
    <Form className="w-96">
      <Title>Enter new Password</Title>
      <FormInput
        type="password"
        label="New Password"
        placeholder="********"
        name="new-password"
      />
      <FormInput
        type="password"
        label="Password Confirm"
        placeholder="********"
        name="password-confirm"
      />
      <Submit value="Reset your password" />
    </Form>
  );
}

export { ResetPassword };
