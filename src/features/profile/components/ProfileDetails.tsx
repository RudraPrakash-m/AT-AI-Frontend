import React, { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      jobTitle: profile.jobTitle || '',
      organization: profile.organization || '',
      bio: profile.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      await onUpdate(data);
      setToastOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', mb: 3 }}>
          <AppAvatar name={profile.name} size={64} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
      </CardContent>
    </Card>
  );
};
