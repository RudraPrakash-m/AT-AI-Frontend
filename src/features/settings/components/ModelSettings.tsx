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
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          Model Defaults & Hyperparameters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure default AI models, temperature creativity levels, and universal system prompts.
        </Typography>

        <Stack spacing={3}>
          {/* Default Model */}
          <FormControl fullWidth size="small">
            <InputLabel id="default-model-select-label">Default Workspace Model</InputLabel>
            <Select
              labelId="default-model-select-label"
              value={settings.defaultModel}
              label="Default Workspace Model"
              onChange={(e) => onUpdate('defaultModel', e.target.value)}
            >
              {AVAILABLE_MODELS.map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name} — ({model.provider})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Temperature Slider */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Temperature: {settings.temperature}
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }} gutterBottom>
              Custom System Instructions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Instructions injected into every new conversation to steer response format and personality.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={settings.systemPrompt}
              onChange={(e) => onUpdate('systemPrompt', e.target.value)}
              placeholder="e.g. You are an expert TypeScript full-stack architect..."
              variant="outlined"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
