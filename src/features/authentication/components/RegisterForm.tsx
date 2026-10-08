import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  Box,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
} from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { registerSchema, type RegisterFormData } from '../validations/auth.validation';
import { useAuth } from '../hooks/useAuth';
import { OtpVerificationView } from './OtpVerificationView';

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await registerUser(data);
      if (res && res.email) {
        setPendingVerificationEmail(res.email);
        if (res.devOtp) setDevOtp(res.devOtp);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pendingVerificationEmail) {
    return (
      <OtpVerificationView
        email={pendingVerificationEmail}
        onBack={() => setPendingVerificationEmail(null)}
        initialMessage="Verification code has been sent to your email."
        devOtp={devOtp}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
      <Stack spacing={{ xs: 1.5, sm: 1.75 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: '10px', py: 0.5 }}>
            {errorMessage}
          </Alert>
        )}

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              label="Full Name"
              placeholder="Rudra Prakash"
              fullWidth
              errorMessage={errors.name?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              label="Email Address"
              placeholder="you@company.com"
              type="email"
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
              placeholder="At least 8 characters"
              type={showPassword ? 'text' : 'password'}
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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              label="Confirm Password"
              placeholder="Repeat your password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              errorMessage={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <Box sx={{ width: '100%', pt: 0.25 }}>
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  cursor: 'pointer',
                  userSelect: 'none',
                  width: '100%',
                }}
              >
                <Checkbox
                  {...field}
                  checked={field.value}
                  size="small"
                  sx={{
                    p: 0,
                    mt: '2px',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    lineHeight: 1.4,
                    flex: 1,
                    wordBreak: 'break-word',
                  }}
                >
                  I agree to the{' '}
                  <Link
                    href="#"
                    color="primary"
                    underline="hover"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ fontWeight: 600 }}
                  >
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link
                    href="#"
                    color="primary"
                    underline="hover"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
              {errors.agreeToTerms && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    ml: 3,
                    fontSize: '0.72rem',
                    lineHeight: 1.2,
                  }}
                >
                  {errors.agreeToTerms.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <AppButton
          type="submit"
          variant="contained"
          size="medium"
          fullWidth
          loading={isSubmitting}
          sx={{
            py: 1.1,
            fontWeight: 700,
            fontSize: { xs: '0.88rem', sm: '0.92rem' },
          }}
        >
          Create Account
        </AppButton>
      </Stack>
    </form>
  );
};
