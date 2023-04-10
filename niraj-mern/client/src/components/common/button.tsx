import type {
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
} from 'react';
import { Spinner } from './spinner';

const Button: FC<
  PropsWithChildren & {
    link?: boolean;
    isLoading?: boolean;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, isLoading, link, ...rest }) => {
  if (link) {
    // link button
    return (
      <button
        className={`dark:text-white text-secondary transition font-normal text-lg cursor-pointer py-1 flex items-center justify-center ${className}`}
        disabled={isLoading}
        {...rest}
      >
        {children}
        {isLoading && ' ...'}
      </button>
    );
  }

  return (
    <button
      className={`w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 flex items-center justify-center ${className}`}
      disabled={isLoading}
      {...rest}
    >
      {children}
      {isLoading && <Spinner />}
    </button>
  );
};

export { Button };
