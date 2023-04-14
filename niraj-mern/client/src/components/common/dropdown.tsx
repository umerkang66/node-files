import React, { useEffect, useRef, FC } from 'react';
import { Panel } from './panel';
import { CustomLink } from './custom-link';

type Props = {
  options: { name: string; link: string }[];
  close: () => void;
};

const Dropdown: FC<Props> = ({ options, close }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!dropdownRef.current) {
        return;
      }
      if (!dropdownRef.current.contains(e.target as HTMLElement)) {
        close();
      }
    };

    // performance.now()
    document.addEventListener('click', listener, true);

    return () => {
      document.removeEventListener('click', listener, true);
    };
  }, [close]);

  const renderedOptions = options.map(option => {
    return (
      <div onClick={close} key={option.link}>
        <CustomLink to={option.link}>
          <div className="hover:bg-sky-100 dark:hover:bg-primary rounded cursor-pointer dark:text-white p-1">
            {option.name}
          </div>
        </CustomLink>
      </div>
    );
  });

  return (
    <div className="absolute right-16 w-48 top-full" ref={dropdownRef}>
      <Panel>{renderedOptions}</Panel>
    </div>
  );
};

export { Dropdown };
