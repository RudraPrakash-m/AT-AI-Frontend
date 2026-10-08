import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  FormControlLabel,
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.25}>
        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: '10px' }}>
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
              placeholder="At least 8 chars with uppercase & number"
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
            <Stack>
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} size="small" />}
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{' '}
                    <Link href="#" color="primary" underline="hover">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" color="primary" underline="hover">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                  {errors.agreeToTerms.message}
                </Typography>
              )}
            </Stack>
          )}
        />

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={isSubmitting}
        >
          Create Free Account
        </AppButton>
      </Stack>
    </form>
  );
};
