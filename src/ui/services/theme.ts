export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

function getUserThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return ThemeMode.Light;
  return (localStorage.getItem('themeMode') as ThemeMode) || ThemeMode.Light
}

function setUserThemeMode(themeMode: ThemeMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('themeMode', themeMode)
}

export { getUserThemeMode, setUserThemeMode }
