/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        /* Surface Architecture */
        surface: {
          DEFAULT: '#0e0e0e',
          dim: '#0e0e0e',
          bright: '#2c2c2c',
          variant: '#262626',
          'container-lowest': '#000000',
          'container-low': '#131313',
          container: '#1a1919',
          'container-high': '#2a2a2a',
          'container-highest': '#262626',
          tint: '#deffac',
        },
        background: '#0e0e0e',

        /* Primary — Neon Lime */
        primary: {
          DEFAULT: '#ABFF02',
          dim: '#9fed00',
          container: '#a9fd00',
          fixed: '#a9fd00',
          'fixed-dim': '#9fed00',
        },
        'on-primary': {
          DEFAULT: '#213600',
          container: '#3c5d00',
          fixed: '#2e4900',
          'fixed-variant': '#436700',
        },
        'inverse-primary': '#446900',

        /* Secondary — Muted Lime */
        secondary: {
          DEFAULT: '#dfec60',
          dim: '#d1dd53',
          container: '#5c6300',
          fixed: '#dfec60',
          'fixed-dim': '#d1dd53',
        },
        'on-secondary': {
          DEFAULT: '#4f5600',
          container: '#f6ff9b',
          fixed: '#3d4300',
          'fixed-variant': '#596000',
        },

        /* Tertiary — Warm Yellow */
        tertiary: {
          DEFAULT: '#fffae3',
          dim: '#f0e34e',
          container: '#fcef59',
          fixed: '#fff25b',
          'fixed-dim': '#f0e34e',
        },
        'on-tertiary': {
          DEFAULT: '#686100',
          container: '#5f5800',
          fixed: '#4d4800',
          'fixed-variant': '#6b6400',
        },

        /* Error */
        error: {
          DEFAULT: '#ff7351',
          dim: '#d53d18',
          container: '#b92902',
        },
        'on-error': {
          DEFAULT: '#450900',
          container: '#ffd2c8',
        },

        /* On-surface */
        'on-surface': {
          DEFAULT: '#ffffff',
          variant: '#8b947a',
        },
        'on-background': '#ffffff',
        'inverse-surface': '#fcf8f8',
        'inverse-on-surface': '#565554',

        /* Outline */
        outline: {
          DEFAULT: '#777575',
          variant: '#494847',
        },
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SpaceGrotesk', 'monospace'],
      },
    },
  },
  plugins: [],
};
