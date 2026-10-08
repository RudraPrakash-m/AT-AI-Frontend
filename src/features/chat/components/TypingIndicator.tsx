import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { AutoAwesome as SparklesIcon } from '@mui/icons-material';

interface TypingIndicatorProps {
  statusText?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusText = 'AT AI is generating response...',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, py: 1, px: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)',
          color: 'primary.main',
        }}
      >
        <SparklesIcon sx={{ fontSize: 16, animation: 'spin 4s linear infinite' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.75 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {statusText}
        </Typography>

        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.4s infinite ease-in-out both',
                animationDelay: `${i * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0.6)',
                    opacity: 0.3,
                  },
                  '40%': {
                    transform: 'scale(1.2)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
