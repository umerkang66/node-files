import classNames from 'classnames';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

const P: FC<
  PropsWithChildren & {
    className?: string;
    remainDarkMode?: boolean;
    center?: boolean;
  } & HTMLAttributes<HTMLParagraphElement>
> = ({ children, remainDarkMode, className, center, ...rest }) => {
  const customClassNames = classNames(
    `${center ? 'text-center' : ''} ${
      remainDarkMode ? 'text-dark-subtle' : 'text-light-subtle '
    }  dark:text-dark-subtle ${className}`
  );

  return (
    <p className={customClassNames} {...rest}>
      {children}
    </p>
  );
};

const Heading: FC<
  PropsWithChildren & {
    className?: string;
    remainDarkMode?: boolean;
  }
> = ({ children, remainDarkMode, className }) => {
  return (
    <h1
      className={`text-center ${
        remainDarkMode ? 'text-dark-subtle' : 'text-light-subtle '
      } dark:text-dark-subtle text-light-subtle font-bold text-2xl ${className}`}
    >
      {children}
    </h1>
  );
};

export { P, Heading };
