import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Link, Box } from '@mui/material';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your AT AI workspace"
      footer={
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              color="primary"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      }
    >
      <LoginForm />
    </AuthCard>
  );
};
