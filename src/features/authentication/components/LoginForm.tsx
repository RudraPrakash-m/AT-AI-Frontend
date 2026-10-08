import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  FormControlLabel,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { loginSchema, type LoginFormData } from '../validations/auth.validation';
import { useAuth } from '../hooks/useAuth';
import { OtpVerificationView } from './OtpVerificationView';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await login(data);
      if (res && res.requireVerification && res.email) {
        setPendingVerificationEmail(res.email);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pendingVerificationEmail) {
    return (
      <OtpVerificationView
        email={pendingVerificationEmail}
        onBack={() => setPendingVerificationEmail(null)}
        initialMessage="Your email address is unverified. Please enter the OTP code sent to your email."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: '10px' }}>
            {errorMessage}
          </Alert>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              label="Email Address"
              placeholder="you@company.com"
              type="email"
              autoComplete="email"
              fullWidth
              errorMessage={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              label="Password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              fullWidth
              errorMessage={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} size="small" />}
                label="Remember me"
                slotProps={{ typography: { variant: 'body2', color: 'text.secondary' } }}
              />
            )}
          />
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            color="primary"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            Forgot password?
          </Link>
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={isSubmitting}
        >
          Sign In to Workspace
        </AppButton>
      </Stack>
    </form>
  );
};
