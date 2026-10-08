import { createTheme, type Theme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { createComponentOverrides } from './components';

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const baseTheme = createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography,
    shape: {
      borderRadius: 10,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
  });

  return createTheme(baseTheme, {
    components: createComponentOverrides(baseTheme),
  });
};
