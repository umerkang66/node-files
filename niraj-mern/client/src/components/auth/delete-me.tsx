import { FC } from 'react';
import { Modal } from '../common/modal';
import { Button } from '../common/button';
import { CustomLink } from '../common/custom-link';
import { Container } from '../common/container';
import { useDeleteMe } from '../../hooks/auth/use-delete-me';
import { P } from '../common/typography';

const DeleteMe: FC = () => {
  const deleteMeMutation = useDeleteMe();

  const modal = (
    <Modal
      actionBar={
        <div className="flex align center">
          <CustomLink to="/" className="mr-3 mt-1">
            Cancel
          </CustomLink>
          <Button
            danger
            isLoading={deleteMeMutation.isLoading}
            onClick={deleteMeMutation.deleteMe}
          >
            Delete Me
          </Button>
        </div>
      }
      // dummy function
      onClose={() => {}}
    >
      <P className="text-lg mb-10">
        Are you sure you want to delete your account.
      </P>
    </Modal>
  );

  return <Container>{modal}</Container>;
};

export { DeleteMe };
