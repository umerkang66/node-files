import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

const Panel: FC<
  PropsWithChildren & { className?: string } & React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({ children, className, ...rest }) => {
  const finalClassNames = classNames(
    'border rounded p-3 shadow bg-dark-subtle dark:bg-light-subtle w-full',
    className
  );

  return (
    <div className={finalClassNames} {...rest}>
      {children}
    </div>
  );
};

export { Panel };
