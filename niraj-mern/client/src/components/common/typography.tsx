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

const Heading: FC<
  PropsWithChildren & {
    className?: string;
  }
> = ({ children, className }) => {
  return (
    <h1
      className={`text-center dark:text-dark-subtle text-light-subtle font-bold text-2xl ${className}`}
    >
      {children}
    </h1>
  );
};

export { P, Heading };
