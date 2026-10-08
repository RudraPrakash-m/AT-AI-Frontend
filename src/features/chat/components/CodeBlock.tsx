import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, useTheme } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { copyToClipboard } from '@/utils/string.utils';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'typescript', code }) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box
      sx={{
        my: 2,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
        bgcolor: isDark ? '#090D16' : '#1E293B',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Code Header Bar */}
      <Stack
        direction="row"
        sx={{
          px: { xs: 1.25, sm: 2 },
          py: { xs: 0.5, sm: 0.75 },
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isDark ? '#111827' : '#0F172A',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <CodeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#94A3B8' }} />
          <Typography
            variant="caption"
            sx={{
              color: '#CBD5E1',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'lowercase',
              fontSize: { xs: '0.72rem', sm: '0.75rem' },
            }}
          >
            {language}
          </Typography>
        </Stack>

        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="copy code snippet"
          sx={{
            color: copied ? '#34D399' : '#94A3B8',
            p: 0.5,
            borderRadius: '6px',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
            },
          }}
        >
          {copied ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <CheckIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: '#34D399' }}>
                Copied!
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <CopyIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, color: 'inherit' }}>
                Copy
              </Typography>
            </Stack>
          )}
        </IconButton>
      </Stack>

      {/* Code Body */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: { xs: 1.25, sm: 2 },
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontSize: { xs: '0.78rem', sm: '0.85rem' },
          lineHeight: 1.55,
          color: '#E2E8F0',
          fontFamily: 'JetBrains Mono, monospace',
          '& code': {
            fontFamily: 'inherit',
          },
        }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );
};
