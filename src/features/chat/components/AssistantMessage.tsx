import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  Stack,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as ThinkingIcon,
  Language as WebIcon,
} from '@mui/icons-material';
import { AppAvatar } from '@/components/common/ui/AppAvatar';
import { formatTime } from '@/utils/date.utils';
import type { ChatMessageEntity } from '../types/chat.types';
import { CodeBlock } from './CodeBlock';
import { MessageActions } from './MessageActions';
import aashditLogo from '@/assets/aashditLogo-removebg-preview.png';

interface AssistantMessageProps {
  message: ChatMessageEntity;
  onRegenerate?: () => void;
  onLikeToggle?: () => void;
  onDislikeToggle?: () => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  onRegenerate,
  onLikeToggle,
  onDislikeToggle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [showThinking, setShowThinking] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        py: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack direction="row" spacing={{ xs: 1, sm: 1.75 }} sx={{ width: '100%', maxWidth: { xs: '100%', md: '92%' } }}>
        <AppAvatar
          size={32}
          src={aashditLogo}
          alt="Aashdit AI"
          sx={{
            width: { xs: 28, sm: 34 },
            height: { xs: 28, sm: 34 },
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            p: 0.5,
            flexShrink: 0,
            '& img': {
              objectFit: 'contain',
            },
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header row: Model tag & features */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
              {message.modelName || 'AT AI Assistant'}
            </Typography>

            {message.webSearchUsed && (
              <Chip
                icon={<WebIcon sx={{ fontSize: '12px !important' }} />}
                label="Web Verified"
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.62rem' }}
              />
            )}

            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
              {formatTime(message.createdAt)}
            </Typography>
          </Stack>

          {/* Collapsible Deep Reasoning / Thinking Section */}
          {message.thinking && (
            <Accordion
              expanded={showThinking}
              onChange={() => setShowThinking((prev) => !prev)}
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                borderRadius: '10px !important',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
                sx={{
                  minHeight: 34,
                  px: 1.25,
                  py: 0.5,
                  '& .MuiAccordionSummary-content': { my: 0.25, alignItems: 'center', gap: 1 },
                }}
              >
                <ThinkingIcon sx={{ fontSize: 15, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.72rem', sm: '0.75rem' } }}>
                  Reasoning Process & Step-by-Step Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.25, pt: 0, pb: 1.25 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    display: 'block',
                    lineHeight: 1.5,
                  }}
                >
                  {message.thinking}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Markdown Content Area */}
          <Box
            sx={{
              color: 'text.primary',
              fontSize: { xs: '0.88rem', sm: '0.94rem' },
              lineHeight: { xs: 1.6, sm: 1.7 },
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              '& h1, & h2, & h3, & h4': {
                fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                fontWeight: 700,
                mt: 1.75,
                mb: 0.75,
                color: 'text.primary',
              },
              '& h1': { fontSize: { xs: '1.25rem', sm: '1.45rem' } },
              '& h2': { fontSize: { xs: '1.15rem', sm: '1.3rem' } },
              '& h3': { fontSize: { xs: '1.05rem', sm: '1.15rem' } },
              '& h4': { fontSize: { xs: '0.95rem', sm: '1rem' } },
              '& p': { my: 0.75 },
              '& ul, & ol': { pl: { xs: 2.5, sm: 3 }, my: 0.75 },
              '& li': { my: 0.35 },
              '& strong': { fontWeight: 600, color: 'text.primary' },
              '& code:not(pre code)': {
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                color: isDark ? '#93C5FD' : '#1D4ED8',
                px: 0.6,
                py: 0.2,
                borderRadius: '5px',
                fontSize: '0.84em',
                fontFamily: 'JetBrains Mono, monospace',
              },
              '& blockquote': {
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                pl: 1.5,
                my: 1.25,
                color: 'text.secondary',
                fontStyle: 'italic',
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');
                  const isInline = !match && !String(children).includes('\n');

                  if (!isInline && (match || codeContent.includes('\n'))) {
                    return <CodeBlock language={match ? match[1] : 'text'} code={codeContent} />;
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                a({ href, children }) {
                  return (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      underline="hover"
                      sx={{ fontWeight: 500 }}
                    >
                      {children}
                    </Link>
                  );
                },
                table({ children }) {
                  return (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        my: 2,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: 'divider',
                        maxWidth: '100%',
                      }}
                    >
                      <Table size="small">{children}</Table>
                    </TableContainer>
                  );
                },
                thead({ children }) {
                  return <TableHead sx={{ bgcolor: 'action.hover' }}>{children}</TableHead>;
                },
                tbody({ children }) {
                  return <TableBody>{children}</TableBody>;
                },
                tr({ children }) {
                  return <TableRow>{children}</TableRow>;
                },
                th({ children }) {
                  return (
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{children}</TableCell>
                  );
                },
                td({ children }) {
                  return <TableCell sx={{ fontSize: '0.85rem' }}>{children}</TableCell>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Box>

          {/* Action Row */}
          <MessageActions
            content={message.content}
            role="assistant"
            onRegenerate={onRegenerate}
            onLikeToggle={onLikeToggle}
            onDislikeToggle={onDislikeToggle}
            isLiked={message.isLiked}
            isDisliked={message.isDisliked}
          />
        </Box>
      </Stack>
    </Box>
  );
};
