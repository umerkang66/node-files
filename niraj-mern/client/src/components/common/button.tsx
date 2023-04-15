import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import { Spinner } from './spinner';
import classNames from 'classnames';

const Button: FC<
  PropsWithChildren & {
    link?: boolean;
    danger?: boolean;
    isLoading?: boolean;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, isLoading, link, danger, ...rest }) => {
  if (link) {
    const customClassNames = classNames(
      `dark:text-white text-secondary transition font-normal text-lg cursor-pointer py-1 flex items-center justify-center ${className}`
    );

    // link button
    return (
      <button className={customClassNames} disabled={isLoading} {...rest}>
        {children}
        {isLoading && ' ...'}
      </button>
    );
  }

  const customClassNames = classNames(
    `w-full rounded dark:text-secondary text-white transition font-semibold text-lg cursor-pointer py-1 px-4 flex items-center justify-center ${className} ${
      danger
        ? 'bg-red-600 dark:bg-red-300 dark:hover:bg-red-300/75 hover:bg-red-600/75'
        : 'dark:bg-white bg-secondary hover:bg-opacity-90'
    }`
  );

  return (
    <button className={customClassNames} disabled={isLoading} {...rest}>
      {children}
      {isLoading && <Spinner />}
    </button>
  );
};

export { Button };
