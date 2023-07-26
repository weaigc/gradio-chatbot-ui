import { ThemeMode } from '~services/theme'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function light() {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}

function dark() {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.remove('light')
  document.documentElement.classList.add('dark')
}

function isSystemDarkMode() {
  if (typeof window === 'undefined') return;
  return !!window.matchMedia(COLOR_SCHEME_QUERY).matches
}

function colorSchemeListener(e: MediaQueryListEvent) {
  if (typeof window === 'undefined') return;
  const colorScheme = e.matches ? 'dark' : 'light'
  if (colorScheme === 'dark') {
    dark()
  } else {
    light()
  }
}

function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  if (mode === ThemeMode.Light) {
    light()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (mode === ThemeMode.Dark) {
    dark()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (isSystemDarkMode()) {
    dark()
  } else {
    light()
  }

  window.matchMedia(COLOR_SCHEME_QUERY).addEventListener('change', colorSchemeListener)
}

function getDefaultThemeColor() {
  return '#7EB8D4'
}

export { applyThemeMode, getDefaultThemeColor }
