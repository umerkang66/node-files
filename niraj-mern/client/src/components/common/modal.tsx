import ReactDOM from 'react-dom';
import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';

type Props = PropsWithChildren & { actionBar: ReactNode; onClose: () => void };

const Modal: FC<Props> = ({ children, actionBar, onClose }) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const JSX = (
    <div className="w-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-300 dark:bg-gray-500 opacity-80"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 min-h-min w-1/2 dark:bg-secondary bg-white rounded-lg">
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex justify-end">{actionBar}</div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(JSX, document.getElementById('modal')!);
};

export { Modal };
