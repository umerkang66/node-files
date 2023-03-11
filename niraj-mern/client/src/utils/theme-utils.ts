type Theme = 'light' | 'dark';

function getTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'light';
}

function setTheme(theme: Theme): void {
  localStorage.setItem('theme', theme);
}

function updateThemeInDocument(theme: Theme, themeToRemove?: Theme): void {
  if (themeToRemove) {
    document.documentElement.classList.remove(themeToRemove);
  }

  document.documentElement.classList.add(theme);
}

export { type Theme, getTheme, setTheme, updateThemeInDocument };
