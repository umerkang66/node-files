import { FC, PropsWithChildren } from 'react';

const P: FC<
  PropsWithChildren & {
    className?: string;
    underlined?: boolean;
  }
> = ({ children, className, underlined }) => {
  return (
    <p
      className={`text-center dark:text-dark-subtle text-light-subtle ${className}`}
    >
      {children}
    </p>
  );
};

export { P };
