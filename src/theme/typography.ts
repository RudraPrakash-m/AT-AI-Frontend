import type { ThemeOptions } from '@mui/material/styles';

export const typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),
  h1: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 700,
    fontSize: '2.25rem',
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 700,
    fontSize: '1.875rem',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
  },
  h4: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.35,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.45,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    letterSpacing: '-0.005em',
  },
  body2: {
    fontSize: '0.84375rem',
    lineHeight: 1.55,
  },
  button: {
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 400,
  },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};
