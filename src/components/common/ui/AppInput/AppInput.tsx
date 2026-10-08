import { forwardRef } from 'react';
import {
  TextField,
  type TextFieldProps,
  FormHelperText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

export type AppInputProps = Omit<TextFieldProps, 'variant'> & {
  label?: string;
  errorMessage?: string;
  hint?: string;
};

export const AppInput = forwardRef<HTMLDivElement, AppInputProps>(
  ({ label, errorMessage, hint, sx, ...props }, ref) => {
    const theme = useTheme();
    const isError = Boolean(errorMessage);

    return (
      <Stack spacing={0.75} sx={{ width: props.fullWidth ? '100%' : 'auto', ...sx }}>
        {label && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isError ? theme.palette.error.main : theme.palette.text.secondary,
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </Typography>
        )}
        <TextField
          ref={ref}
          variant="outlined"
          error={isError}
          size="small"
          {...props}
        />
        {errorMessage && (
          <FormHelperText error sx={{ mx: 0.5, mt: 0.25, fontSize: '0.75rem' }}>
            {errorMessage}
          </FormHelperText>
        )}
        {!errorMessage && hint && (
          <FormHelperText sx={{ mx: 0.5, mt: 0.25, fontSize: '0.75rem', color: 'text.disabled' }}>
            {hint}
          </FormHelperText>
        )}
      </Stack>
    );
  }
);

AppInput.displayName = 'AppInput';
