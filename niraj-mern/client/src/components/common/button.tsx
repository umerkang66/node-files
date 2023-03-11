import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

const Button: FC<
  PropsWithChildren & {
    isLoading?: boolean;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, isLoading, ...rest }) => {
  return (
    <button
      className={`w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 ${className}`}
      disabled={isLoading}
      {...rest}
    >
      {children} {isLoading ? '...' : ''}
    </button>
  );
};

export { Button };
