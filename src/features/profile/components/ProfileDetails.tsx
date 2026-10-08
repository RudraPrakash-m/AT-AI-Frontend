import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { AppAvatar } from '@/components/common/ui/AppAvatar';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { profileSchema, type ProfileFormData } from '../validations/profile.validation';
import type { UserProfile } from '../types/profile.types';

interface ProfileDetailsProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<UserProfile>;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile, onUpdate }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      email: profile.email || '',
      jobTitle: profile.jobTitle || '',
      organization: profile.organization || '',
      bio: profile.bio || '',
    },
  });

  useEffect(() => {
    reset({
      name: profile.name || '',
      email: profile.email || '',
      jobTitle: profile.jobTitle || '',
      organization: profile.organization || '',
      bio: profile.bio || '',
    });
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onUpdate(data);
      reset(data);
      setToastOpen(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: { xs: '14px', sm: '16px' },
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.14)'),
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0C1424' : '#FFFFFF'),
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.75, md: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2.5 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
          <AppAvatar name={profile.name} size={56} sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {profile.email} • {profile.plan} Plan Member
            </Typography>
          </Box>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Display Name"
                    fullWidth
                    errorMessage={errors.name?.message}
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
                    fullWidth
                    errorMessage={errors.email?.message}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Role / Title"
                    placeholder="Staff Software Engineer"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Company / Team"
                    placeholder="AI Labs Inc."
                    fullWidth
                  />
                )}
              />
            </Stack>

            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <AppInput
                  {...field}
                  label="Bio / Profile Summary"
                  placeholder="Tell us about yourself..."
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <AppButton
                type="submit"
                variant="contained"
                disabled={!isDirty}
                loading={isSubmitting}
              >
                Save Changes
              </AppButton>
            </Box>
          </Stack>
        </form>

        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ borderRadius: '10px' }}>
            Profile updated successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={4000}
          onClose={() => setErrorMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ borderRadius: '10px' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
