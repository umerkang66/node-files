import { useParams, useSearchParams } from 'react-router-dom';
import { Form } from '../common/form';
import { Heading } from '../common/typography';
import { useConfirmAdminSignup } from '../../hooks/auth/use-confirm-admin-signup';
import { useEffect } from 'react';
import { Spinner } from '../common/spinner';

const ConfirmAdminSignup = () => {
  const [searchParams] = useSearchParams();
  const { userId } = useParams();
  const token = searchParams.get('token');
  const { confirmAdminSignup, isLoading } = useConfirmAdminSignup(
    userId!,
    token!
  );

  useEffect(() => {
    confirmAdminSignup();
  }, [confirmAdminSignup]);

  return (
    <Form className="flex justify-center items-center">
      <Heading className="mr-5">Confirming for Admin Signup</Heading>
      {isLoading ? <Spinner /> : null}
    </Form>
  );
};

export { ConfirmAdminSignup };
