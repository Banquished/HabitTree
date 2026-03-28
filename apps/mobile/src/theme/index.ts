import { Platform } from 'react-native'

export const colors = {
  surface: {
    DEFAULT: '#0e0e0e',
    dim: '#0e0e0e',
    bright: '#2c2c2c',
    variant: '#262626',
    containerLowest: '#000000',
    containerLow: '#131313',
    container: '#1a1919',
    containerHigh: '#2a2a2a',
    containerHighest: '#262626',
    tint: '#deffac',
  },
  background: '#0e0e0e',

  primary: {
    DEFAULT: '#ABFF02',
    dim: '#9fed00',
    container: '#a9fd00',
    fixed: '#a9fd00',
    fixedDim: '#9fed00',
  },
  onPrimary: {
    DEFAULT: '#213600',
    container: '#3c5d00',
    fixed: '#2e4900',
    fixedVariant: '#436700',
  },
  inversePrimary: '#446900',

  secondary: {
    DEFAULT: '#dfec60',
    dim: '#d1dd53',
    container: '#5c6300',
  },
  onSecondary: {
    DEFAULT: '#4f5600',
    container: '#f6ff9b',
  },

  tertiary: {
    DEFAULT: '#fffae3',
    dim: '#f0e34e',
    container: '#fcef59',
  },
  onTertiary: {
    DEFAULT: '#686100',
    container: '#5f5800',
  },

  error: {
    DEFAULT: '#ff7351',
    dim: '#d53d18',
    container: '#b92902',
  },
  onError: {
    DEFAULT: '#450900',
    container: '#ffd2c8',
  },

  onSurface: {
    DEFAULT: '#ffffff',
    variant: '#8b947a',
  },
  onBackground: '#ffffff',

  outline: {
    DEFAULT: '#777575',
    variant: '#494847',
  },
} as const

export const radii = {
  none: 0,
} as const

export const fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'system-ui',
    mono: 'monospace',
  },
})!
