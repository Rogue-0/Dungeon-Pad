import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

import { paletteForMode, type AppColors, type ThemeMode } from './palettes';
import { useThemeStore, type ThemePreference } from './theme-store';

/**
 * Returns the currently active theme mode ('light' | 'dark'),
 * resolving the user's stored preference against the system setting.
 */
export function useThemeMode(): ThemeMode {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((s) => s.preference);

  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

/**
 * Returns the reactive color palette for the active theme.
 * Pair with `useMemo(() => StyleSheet.create({...}), [colors])` inside components
 * so styles rebuild when the theme changes.
 */
export function useColors(): AppColors {
  const mode = useThemeMode();
  return useMemo(() => paletteForMode(mode), [mode]);
}

/**
 * Returns the current user preference ('system' | 'light' | 'dark')
 * plus setter. Useful for a Settings toggle.
 */
export function useThemePreference(): [ThemePreference, (p: ThemePreference) => void] {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  return [preference, setPreference];
}
