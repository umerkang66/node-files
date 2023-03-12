import { createContext, useContext, useEffect } from 'react';

import {
  getThemeFromLocalStorage,
  setThemeFromLocalStorage,
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
    const previousTheme = getThemeFromLocalStorage();
    const newTheme: Theme = previousTheme === 'light' ? 'dark' : 'light';

    updateThemeInDocument(newTheme, previousTheme);
    setThemeFromLocalStorage(newTheme);
  }

  useEffect(() => {
    const theme = getThemeFromLocalStorage();
    updateThemeInDocument(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { useThemeContext, ThemeContextProvider };
