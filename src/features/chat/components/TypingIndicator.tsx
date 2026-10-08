import React from 'react';
import { Box, Typography } from '@mui/material';
import aashditLogo from '@/assets/aashditLogo-removebg-preview.png';

interface TypingIndicatorProps {
  statusText?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusText = 'AT AI is generating response...',
}) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, py: 1, px: 0.5 }}>
      <Box
        component="img"
        src={aashditLogo}
        alt="Aashdit AI"
        sx={{
          width: 24,
          height: 24,
          objectFit: 'contain',
          animation: 'pulseLogo 2s infinite ease-in-out',
          '@keyframes pulseLogo': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.85 },
            '50%': { transform: 'scale(1.1)', opacity: 1 },
          },
        }}
      />

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
