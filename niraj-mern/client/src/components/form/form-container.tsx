import { FC, PropsWithChildren } from 'react';

const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="fixed inset-0 dark:bg-primary bg-white -z-10 flex justify-center items-center">
      {children}
    </div>
  );
};

export { FormContainer };
