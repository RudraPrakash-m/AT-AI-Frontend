import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Slider,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { AVAILABLE_MODELS } from '@/constants';
import type { UserSettings } from '../types/settings.types';

interface ModelSettingsProps {
  settings: UserSettings;
  onUpdate: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({
  settings,
  onUpdate,
}) => {
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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.25rem' } }} gutterBottom>
          Model Defaults & Hyperparameters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
          Configure default AI models, temperature creativity levels, and universal system prompts.
        </Typography>

        <Stack spacing={2.5}>
          {/* Default Model */}
          <FormControl fullWidth size="small">
            <InputLabel id="default-model-select-label">Default Workspace Model</InputLabel>
            <Select
              labelId="default-model-select-label"
              value={settings.defaultModel}
              label="Default Workspace Model"
              onChange={(e) => onUpdate('defaultModel', e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              {AVAILABLE_MODELS.map((model) => (
                <MenuItem key={model.id} value={model.id} sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {model.name} <Typography component="span" variant="caption" color="text.secondary">({model.provider})</Typography>
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Temperature Slider */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Temperature: {settings.temperature}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                {settings.temperature < 0.4 ? 'Deterministic & Precise' : settings.temperature > 1.2 ? 'Highly Creative' : 'Balanced'}
              </Typography>
            </Box>
            <Slider
              value={settings.temperature}
              min={0}
              max={2}
              step={0.1}
              onChange={(_, val) => onUpdate('temperature', val as number)}
              valueLabelDisplay="auto"
            />
          </Box>

          <Divider />

          {/* System Prompt */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.875rem' } }} gutterBottom>
              Custom System Instructions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
              Instructions injected into every new conversation to steer response format and personality.
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              value={settings.systemPrompt}
              onChange={(e) => onUpdate('systemPrompt', e.target.value)}
              placeholder="e.g. You are an expert TypeScript full-stack architect..."
              variant="outlined"
              slotProps={{
                input: {
                  sx: { borderRadius: '10px', fontSize: { xs: '0.85rem', sm: '0.9rem' } },
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
