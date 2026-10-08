import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  Box,
  Alert,
  Link,
  useTheme,
} from '@mui/material';
import { MarkEmailReadOutlined, Refresh as RefreshIcon } from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { useAuth } from '../hooks/useAuth';

interface OtpVerificationViewProps {
  email: string;
  onBack?: () => void;
  initialMessage?: string;
  devOtp?: string;
}

export const OtpVerificationView: React.FC<OtpVerificationViewProps> = ({
  email,
  onBack,
  initialMessage,
  devOtp,
}) => {
  const { verifyOtp, resendOtp } = useAuth();
  const [otp, setOtp] = useState(devOtp || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    initialMessage || 'Verification code sent to your email.'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage(null);
      await verifyOtp({ email, otp: otp.trim() });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    try {
      setIsResending(true);
      setErrorMessage(null);
      const res = await resendOtp({ email });
      setSuccessMessage(res.message || 'A new verification code was sent to your email.');
      if (res.devOtp) setOtp(res.devOtp);
      setCountdown(60);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleVerify} noValidate>
      <Stack spacing={2.5} sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
          }}
        >
          <MarkEmailReadOutlined sx={{ fontSize: 28 }} />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5, fontWeight: 700 }}>
            Check Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We sent a 6-digit verification code to
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
            {email}
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: '10px', textAlign: 'left' }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && !errorMessage && (
          <Alert severity="success" sx={{ borderRadius: '10px', textAlign: 'left' }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ mt: 1 }}>
          <AppInput
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            label="Verification Code (OTP)"
            fullWidth
            slotProps={{
              input: {
                style: {
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  letterSpacing: '0.45em',
                  fontWeight: 700,
                },
              },
            }}
          />
        </Box>

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={isVerifying}
          disabled={otp.length < 6}
        >
          Verify & Continue
        </AppButton>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
          {onBack ? (
            <Link
              component="button"
              type="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={onBack}
            >
              ← Back
            </Link>
          ) : <Box />}

          <Box>
            {countdown > 0 ? (
              <Typography variant="caption" color="text.secondary">
                Resend code in {countdown}s
              </Typography>
            ) : (
              <Link
                component="button"
                type="button"
                variant="body2"
                color="primary"
                underline="hover"
                onClick={handleResend}
                disabled={isResending}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
              >
                <RefreshIcon sx={{ fontSize: 16 }} /> Resend OTP
              </Link>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
