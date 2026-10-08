import type { Components, Theme } from '@mui/material/styles';

export const createComponentOverrides = (theme: Theme): Components<Theme> => {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 16px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.15s ease-in-out',
        },
        contained: {
          background: isDark
            ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          boxShadow: isDark
            ? '0 4px 14px 0 rgba(37, 99, 235, 0.35)'
            : '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: isDark
              ? '0 6px 20px 0 rgba(37, 99, 235, 0.45)'
              : '0 6px 20px 0 rgba(37, 99, 235, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: theme.palette.divider,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.main,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '14px',
        },
        outlined: {
          borderColor: theme.palette.divider,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? '#0D1117' : '#F9FAFB',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#111827',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: '6px',
          padding: '5px 9px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
        arrow: {
          color: isDark ? '#1F2937' : '#111827',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '18px',
          boxShadow: isDark
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
            : '0 24px 48px -12px rgba(0, 0, 0, 0.12)',
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(19, 27, 42, 0.7)' : 'rgba(248, 250, 252, 0.8)',
          transition: 'all 0.15s ease-in-out',
          '& fieldset': {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            transition: 'border-color 0.15s ease-in-out',
          },
          '&:hover fieldset': {
            borderColor: isDark ? '#64748B' : '#94A3B8',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1.5px',
          },
          '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
            WebkitBoxShadow: isDark
              ? '0 0 0 1000px #131B2A inset !important'
              : '0 0 0 1000px #F8FAFC inset !important',
            WebkitTextFillColor: isDark ? '#F8FAFC !important' : '#0F172A !important',
            caretColor: isDark ? '#F8FAFC' : '#0F172A',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        },
        input: {
          padding: '10.5px 14px',
          fontSize: '0.92rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.15s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
            },
          },
        },
      },
    },
  };
};
