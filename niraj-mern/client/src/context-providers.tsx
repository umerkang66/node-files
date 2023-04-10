import type { PropsWithChildren, FC } from 'react';
import { ThemeContextProvider } from './context/theme-provider';

const ContextProviders: FC<PropsWithChildren> = props => {
  return (
    <ThemeContextProvider>
      {props.children}
    </ThemeContextProvider>
  );
};

export { ContextProviders };
