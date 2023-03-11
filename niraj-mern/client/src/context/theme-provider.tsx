import { createContext, useContext, useEffect } from 'react';

import {
  getTheme,
  setTheme,
  Theme,
  updateThemeInDocument,
} from '../utils/theme-utils';

type ThemeValues = { toggleTheme: () => void };
const ThemeContext = createContext({
  toggleTheme: () => {},
} as ThemeValues);

function useThemeContext() {
  return useContext(ThemeContext);
}

function ThemeContextProvider({ children }: React.PropsWithChildren) {
  function toggleTheme() {
    const previousTheme = getTheme();
    const newTheme: Theme = previousTheme === 'light' ? 'dark' : 'light';

    updateThemeInDocument(newTheme, previousTheme);
    setTheme(newTheme);
  }

  useEffect(() => {
    const theme = getTheme();
    updateThemeInDocument(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { useThemeContext, ThemeContextProvider };
