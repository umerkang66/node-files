import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';

const Button: FC<
  PropsWithChildren & {
    isLoading?: boolean;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, isLoading, ...rest }) => {
  return (
    <button
      className={`w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 flex items-center justify-center ${className}`}
      disabled={isLoading}
      {...rest}
    >
      {children}
      {isLoading && (
        <SpinnerCircularFixed
          className="ml-2"
          size={23}
          speed={300}
          thickness={200}
          // color="#382b2b"
          // secondaryColor="#6e5656"
          color="#fff"
          secondaryColor="#b5b5b5"
        />
      )}
    </button>
  );
};

export { Button };
