import type { FC, PropsWithChildren } from 'react';

const Title: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="text-xl dark:text-white text-secondary font-semibold text-center">
      {children}
    </h1>
  );
};

export { Title };
