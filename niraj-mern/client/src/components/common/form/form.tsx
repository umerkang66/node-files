import type { FC, FormEventHandler, PropsWithChildren } from 'react';
import { Container } from '../container';
import { FormContainer } from './form-container';

const Form: FC<
  PropsWithChildren & {
    className?: string;
    onSubmit?: () => void;
  }
> = ({ children, className, onSubmit }) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <FormContainer>
      <Container>
        <form
          onSubmit={handleSubmit}
          className={`dark:bg-secondary bg-white border-2 rounded p-6 space-y-6 ${className}`}
        >
          {children}
        </form>
      </Container>
    </FormContainer>
  );
};

export { Form };
