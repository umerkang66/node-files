import { ChangeEventHandler, FC, useState } from 'react';

import { Title, FormInput, Submit, Form } from '../common/form';
import { useUpdateMe } from '../../hooks/auth/use-update-me';

const UpdateMe: FC = () => {
  const updateMeMutation = useUpdateMe();
  const [updateMeInfo, setUpdateMeInfo] = useState({ name: '' });

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { name, value } = e.target;
    setUpdateMeInfo(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    updateMeMutation.updateMe(updateMeInfo);
  };

  return (
    <Form className="w-72" onSubmit={onSubmit}>
      <Title>Update Me</Title>
      <FormInput
        label="Name"
        name="name"
        type="text"
        onChange={onChange}
        value={updateMeInfo.name}
      />
      <Submit value="Update Me" isLoading={updateMeMutation.isLoading} />
    </Form>
  );
};

export { UpdateMe };
