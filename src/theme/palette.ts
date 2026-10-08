import { type PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0284C7', // Crisp Aashdit Azure Blue
    light: '#38BDF8', // Electric Cyan
    dark: '#0369A1',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F59E0B', // Vibrant Aashdit Golden Amber Swoosh
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F1F6FB', // Soft azure tinted light background
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0B1528',
    secondary: '#475569',
    disabled: '#94A3B8',
  },
  divider: 'rgba(2, 132, 199, 0.14)',
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  info: {
    main: '#00A3FF',
    light: '#38BDF8',
    dark: '#0284C7',
  },
  action: {
    hover: 'rgba(2, 132, 199, 0.06)',
    selected: 'rgba(2, 132, 199, 0.12)',
    disabled: 'rgba(15, 23, 42, 0.26)',
    disabledBackground: 'rgba(15, 23, 42, 0.06)',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#00A3FF', // Glowing Aashdit Electric Cyan-Blue
    light: '#38BDF8',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F59E0B', // Glowing Aashdit Golden Amber Swoosh
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#070D18', // Deep Midnight Azure
    paper: '#0C1424', // Rich Aashdit Navy Slate
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  divider: 'rgba(0, 163, 255, 0.14)', // Subtle Cyan-tinted dividers
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
  },
  info: {
    main: '#00A3FF',
    light: '#7DD3FC',
    dark: '#0284C7',
  },
  action: {
    hover: 'rgba(0, 163, 255, 0.08)',
    selected: 'rgba(0, 163, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.08)',
  },
};
