import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { SUGGESTED_PROMPT_CATEGORIES } from '@/constants';

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', maxWidth: 760, mx: 'auto', my: 'auto', py: 4, px: 2 }}>
      {/* Hero Welcome */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 5, gap: 1.5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.75,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            boxShadow: '0 12px 28px -6px rgba(37, 99, 235, 0.4)',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-6px)' },
            },
          }}
        >
          <SparklesIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
            background: isDark
              ? 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          What would you like to build today?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540 }}>
          Explore multi-model intelligence for software architecture, rapid debugging, code generation, and deep analysis.
        </Typography>
      </Box>

      {/* Suggested Prompt Cards */}
      <Grid container spacing={2}>
        {SUGGESTED_PROMPT_CATEGORIES.flatMap((category) => category.prompts).slice(0, 4).map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6 }} key={idx}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                bgcolor: isDark ? 'rgba(19, 27, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: isDark
                    ? '0 12px 24px -6px rgba(0, 0, 0, 0.5)'
                    : '0 12px 24px -6px rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <CardActionArea
                onClick={() => onSelectPrompt(item.prompt)}
                sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <CardContent sx={{ p: 0, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {item.title}
                    </Typography>
                    <ArrowIcon sx={{ fontSize: 16, color: 'text.disabled', transition: 'transform 0.15s ease' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.45 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
