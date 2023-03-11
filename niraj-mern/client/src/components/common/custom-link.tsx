import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type Props = PropsWithChildren & { to: string };

const CustomLink: FC<Props> = ({ to, children }) => {
  return (
    <Link
      className="dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition"
      to={to}
    >
      {children}
    </Link>
  );
};

export { CustomLink };
