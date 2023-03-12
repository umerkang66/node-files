import { FC, PropsWithChildren } from 'react';

const P: FC<
  PropsWithChildren & {
    className?: string;
  }
> = ({ children, className }) => {
  return (
    <p
      className={`text-center dark:text-dark-subtle text-light-subtle ${className}`}
    >
      {children}
    </p>
  );
};

export { P };
