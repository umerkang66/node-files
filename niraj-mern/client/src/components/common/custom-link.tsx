import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type Props = PropsWithChildren & { to: string };

const CustomLink: FC<Props> = ({ to, children }) => {
  return (
    <Link className="text-dark-subtle hover:text-white transition" to={to}>
      {children}
    </Link>
  );
};

export { CustomLink };
