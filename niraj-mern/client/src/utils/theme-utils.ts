type Theme = 'light' | 'dark';

function getThemeFromLocalStorage(): Theme {
  return (
    (localStorage.getItem('theme') as Theme) || 'light'
  );
}

function setThemeToLocalStorage(theme: Theme): void {
  localStorage.setItem('theme', theme);
}

function updateThemeInDocument(
  theme: Theme,
  themeToRemove?: Theme
): void {
  if (themeToRemove) {
    document.documentElement.classList.remove(
      themeToRemove
    );
  }

  document.documentElement.classList.add(theme);
}

export {
  type Theme,
  getThemeFromLocalStorage,
  setThemeToLocalStorage,
  updateThemeInDocument,
};
