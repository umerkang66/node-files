import { ChangeEventHandler, FC, useState } from 'react';

import { Title, FormInput, Submit, Form } from '../common/form';
import { useUpdatePassword } from '../../hooks/auth/use-update-password';

const UpdatePassword: FC = () => {
  const [updatePasswordInfo, setUpdatePasswordInfo] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
  });
  const updatePasswordMutation = useUpdatePassword();

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { name, value } = e.target;
    setUpdatePasswordInfo(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    updatePasswordMutation.updatePassword(updatePasswordInfo);
  };

  return (
    <Form className="w-72" onSubmit={onSubmit}>
      <Title>Update Password</Title>
      <FormInput
        label="Current Password"
        placeholder="********"
        name="currentPassword"
        type="password"
        onChange={onChange}
        value={updatePasswordInfo.currentPassword}
      />
      <FormInput
        label="Password"
        placeholder="********"
        name="password"
        type="password"
        onChange={onChange}
        value={updatePasswordInfo.password}
      />
      <FormInput
        label="Password Confirm"
        placeholder="********"
        name="passwordConfirm"
        type="password"
        onChange={onChange}
        value={updatePasswordInfo.passwordConfirm}
      />
      <Submit
        value="Update Password"
        isLoading={updatePasswordMutation.isLoading}
      />
    </Form>
  );
};

export { UpdatePassword };
