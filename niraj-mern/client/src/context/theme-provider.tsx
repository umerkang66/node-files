import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

import {
  getThemeFromLocalStorage,
  setThemeToLocalStorage,
  Theme,
  updateThemeInDocument,
} from '../utils/theme-utils';

type ThemeValues = { toggleTheme: () => void };
const ThemeContext = createContext({
  toggleTheme: () => {},
} as ThemeValues);

const useThemeContext = () => useContext(ThemeContext);

type ThemeCP = FC<PropsWithChildren>;

const ThemeContextProvider: ThemeCP = ({ children }) => {
  const toggleTheme = () => {
    const previousTheme = getThemeFromLocalStorage();
    const newTheme: Theme =
      previousTheme === 'light' ? 'dark' : 'light';

    updateThemeInDocument(newTheme, previousTheme);
    setThemeToLocalStorage(newTheme);
  };

  useEffect(() => {
    const theme = getThemeFromLocalStorage();
    updateThemeInDocument(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { useThemeContext, ThemeContextProvider };
