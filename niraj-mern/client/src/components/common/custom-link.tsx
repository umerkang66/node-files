import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type Props = PropsWithChildren & {
  to: string;
  className?: string;
};

const CustomLink: FC<Props> = ({ to, children, className }) => {
  return (
    <Link
      className={`dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};

export { CustomLink };
