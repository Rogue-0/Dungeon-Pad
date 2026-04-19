/**
 * Light + Dark color palettes.
 * Both share the same shape so components can reference `colors.X` interchangeably.
 * Contrast targets: WCAG AA (4.5:1 for normal text, 3:1 for large text / UI borders).
 */

export const lightColors = {
  // Backgrounds — warm parchment tones
  background: '#FAF9F7',
  surface: '#FFFFFF',
  surfaceHover: '#F5F3F0',
  surfaceSecondary: '#EFEDE9',
  overlay: 'rgba(0,0,0,0.15)',

  // Borders & Strokes
  border: '#E5E2DD',
  muted: '#848484',
  foreground: '#1A1A1A',

  // Text hierarchy (vs. #FAF9F7 background)
  text: {
    primary: '#1A1A1A',   // 15.8:1 — AAA
    secondary: '#4A4A4A', // 8.5:1 — AAA
    tertiary: '#6B6B6B',  // 5.4:1 — AA
  },

  // Primary (green)
  primary: {
    default: '#77C883',
    hover: '#4FA65C',
    pressed: '#42964F',
  },
  // Secondary (dark green — used for secondary buttons)
  secondary: {
    default: '#4FA65C',
    hover: '#42964F',
    pressed: '#386E3F',
  },
  // Destructive (red)
  destructive: {
    default: '#E25151',
    hover: '#D44949',
    pressed: '#C93D3D',
  },
  // Text variant (dark green)
  textVariant: {
    default: '#455C41',
    light: '#5A7A55',
    dark: '#2E3F2B',
  },
  // Error
  error: {
    stroke: '#C72A2A',
    background: '#FFEEEE',
  },

  // Tonal helpers for scenes / backgrounds
  sceneTint: 'rgba(250, 249, 247, 0.25)', // subtle overlay over scene backgrounds
} as const;

export const darkColors: typeof lightColors = {
  // Backgrounds — warm dark (brown-black) to echo parchment aesthetic at night
  background: '#171412',
  surface: '#221E1B',
  surfaceHover: '#2B2623',
  surfaceSecondary: '#1E1A17',
  overlay: 'rgba(0,0,0,0.55)',

  // Borders & Strokes — readable vs. surface
  border: '#3A3430',
  muted: '#8E8882',
  foreground: '#F2EEE8',

  // Text hierarchy (vs. #171412 background)
  text: {
    primary: '#F2EEE8',   // ~15.6:1 — AAA
    secondary: '#C9C3BB', // ~9.8:1 — AAA
    tertiary: '#9A938B',  // ~5.1:1 — AA
  },

  // Primary (green) — slightly brighter to keep contrast over dark
  primary: {
    default: '#7FD28B',
    hover: '#96E29E',
    pressed: '#6FBD7A',
  },
  secondary: {
    default: '#7FD28B',
    hover: '#96E29E',
    pressed: '#6FBD7A',
  },
  destructive: {
    default: '#F07171',
    hover: '#F48787',
    pressed: '#D65858',
  },
  textVariant: {
    default: '#A8C79C',
    light: '#C6DEB9',
    dark: '#8AA87E',
  },
  error: {
    stroke: '#F07171',
    background: '#3A1E1E',
  },

  sceneTint: 'rgba(23, 20, 18, 0.3)',
} as const;

export type AppColors = typeof lightColors;
export type ThemeMode = 'light' | 'dark';

export function paletteForMode(mode: ThemeMode): AppColors {
  return mode === 'dark' ? darkColors : lightColors;
}
