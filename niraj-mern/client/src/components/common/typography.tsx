import { FC, PropsWithChildren } from 'react';

const P: FC<PropsWithChildren> = ({ children }) => {
  return (
    <p className="text-center dark:text-dark-subtle text-light-subtle">
      {children}
    </p>
  );
};

export { P };
