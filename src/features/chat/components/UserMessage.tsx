import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, TextField, IconButton } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { AppAvatar } from '@/components/common/ui/AppAvatar';
import { formatTime } from '@/utils/date.utils';
import type { ChatMessageEntity } from '../types/chat.types';
import { MessageActions } from './MessageActions';

interface UserMessageProps {
  message: ChatMessageEntity;
  userName?: string;
  onEditSubmit?: (newContent: string) => void;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  userName = 'Rudra',
  onEditSubmit,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);

  const handleSave = () => {
    if (editedText.trim() && editedText !== message.content && onEditSubmit) {
      onEditSubmit(editedText.trim());
    }
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        py: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, maxWidth: { xs: '90%', sm: '80%', md: '72%' } }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {isEditing ? (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                width: '100%',
                bgcolor: isDark ? '#1E293B' : '#EFF6FF',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: '16px',
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                variant="standard"
                slotProps={{ input: { disableUnderline: true, style: { fontSize: '0.93rem' } } }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                <IconButton size="small" onClick={() => setIsEditing(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="primary" onClick={handleSave}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                py: 1.5,
                px: 2.25,
                borderRadius: '18px 18px 4px 18px',
                bgcolor: isDark ? '#1E293B' : '#E0E7FF',
                color: isDark ? '#F1F5F9' : '#1E1B4B',
                boxShadow: isDark
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(37, 99, 235, 0.08)',
              }}
            >
              {/* Media Attachments Preview */}
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: message.content ? 1.5 : 0 }}>
                  {message.attachments.map((att) => (
                    <Box key={att.id}>
                      {att.url ? (
                        <Box
                          component="img"
                          src={att.url}
                          alt={att.name}
                          sx={{
                            maxWidth: 220,
                            maxHeight: 180,
                            borderRadius: '10px',
                            objectFit: 'cover',
                            display: 'block',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 0.75,
                            px: 1.25,
                            borderRadius: '8px',
                            bgcolor: 'rgba(0, 0, 0, 0.15)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          <span>📄 {att.name}</span>
                          <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.68rem' }}>
                            ({(att.size / 1024).toFixed(1)} KB)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {message.content && (
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '0.935rem',
                    lineHeight: 1.6,
                  }}
                >
                  {message.content}
                </Typography>
              )}
            </Paper>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 0.5, px: 0.5 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
              {formatTime(message.createdAt)}
            </Typography>
            <MessageActions
              content={message.content}
              role="user"
              onEdit={onEditSubmit ? () => setIsEditing(true) : undefined}
            />
          </Box>
        </Box>

        <AppAvatar name={userName} size={32} status="online" />
      </Box>
    </Box>
  );
};
