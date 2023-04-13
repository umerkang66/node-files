import type { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & { className?: string };

const Container: FC<Props> = ({ children, className }) => {
  return (
    <div className={'max-w-full px-4 mx-auto ' + className}>{children}</div>
  );
};

export { Container };
