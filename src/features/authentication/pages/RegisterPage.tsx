import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Link, Box } from '@mui/material';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Start creating with next-generation AI models"
      footer={
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              color="primary"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
};
