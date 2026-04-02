/**
 * Dungeon Pad Design Tokens
 * Single source of truth for all visual styles — derived from Figma specs.
 * Components should import from here, never hardcode values.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  background: '#FAF9F7',
  surface: '#FFFFFF',
  surfaceHover: '#F5F3F0',
  surfaceSecondary: '#EFEDE9',

  // Borders & Strokes
  border: '#E5E2DD',
  muted: '#848484',
  foreground: '#000000',

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

  // Error
  error: {
    stroke: '#C72A2A',
    background: '#FFEEEE',
  },
} as const;

// ─── Spacing (8px base grid) ─────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const typography = {
  titleLarge: {
    fontFamily: 'Magra-Bold',
    fontSize: 64,
  },
  titleMedium: {
    fontFamily: 'Magra-Bold',
    fontSize: 52,
  },
  titleSmall: {
    fontFamily: 'Magra-Bold',
    fontSize: 42,
  },
  subtitleLarge: {
    fontFamily: 'Magra-Bold',
    fontSize: 28,
  },
  subtitleMedium: {
    fontFamily: 'Magra-Bold',
    fontSize: 24,
  },
  subtitleSmall: {
    fontFamily: 'Magra-Bold',
    fontSize: 18,
  },
  bodyLarge: {
    fontFamily: 'Magra-Regular',
    fontSize: 24,
  },
  bodyMedium: {
    fontFamily: 'Magra-Regular',
    fontSize: 16,
  },
  bodySmall: {
    fontFamily: 'Magra-Regular',
    fontSize: 12,
  },
} as const;

// ─── Border Radii ────────────────────────────────────────────────────────────

export const radii = {
  card: 16,
  accordion: 16,
  button: 50,
  input: 16,
} as const;

// ─── Component Sizes ─────────────────────────────────────────────────────────

export const componentSizes = {
  card: {
    width: 334,
    height: 307,
  },
  accordion: {
    collapsedHeight: 61,
    expandedHeight: 201,
  },
  button: {
    height: 43,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  input: {
    height: 49,
  },
  strokeWidth: 2,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  accordion: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
} as const;

// ─── Type Helpers ────────────────────────────────────────────────────────────

export type ColorToken = typeof colors;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography;
