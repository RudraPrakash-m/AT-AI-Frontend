import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Typography,
  Link,
  Box,
  InputAdornment,
  Alert,
} from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { AuthCard } from '../components/AuthCard';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../validations/auth.validation';
import { authService } from '../services/auth.service';

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email to receive recovery instructions"
      footer={
        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            color="primary"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
          >
            <ArrowBack fontSize="small" /> Back to Sign In
          </Link>
        </Box>
      }
    >
      {isSubmitted ? (
        <Stack spacing={2} sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="success" sx={{ borderRadius: '10px' }}>
            Instructions have been sent to your email address. Please check your inbox.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Didn&apos;t receive an email? Check your spam folder or try again in a few minutes.
          </Typography>
        </Stack>
      ) : (
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

            <AppButton
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              loading={isSubmitting}
            >
              Send Reset Link
            </AppButton>
          </Stack>
        </form>
      )}
    </AuthCard>
  );
};
