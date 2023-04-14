import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const P: FC<
  PropsWithChildren & {
    className?: string;
    remainDarkMode?: boolean;
  } & HTMLAttributes<HTMLParagraphElement>
> = ({ children, remainDarkMode, className, ...rest }) => {
  return (
    <p
      className={`text-center ${
        remainDarkMode ? '' : 'dark:text-light-subtle '
      }  text-dark-subtle ${className}`}
      {...rest}
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
