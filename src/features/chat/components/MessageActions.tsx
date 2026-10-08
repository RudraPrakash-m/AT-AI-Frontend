import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  ThumbUpOutlined as ThumbUpIcon,
  ThumbUp as ThumbUpFilledIcon,
  ThumbDownOutlined as ThumbDownIcon,
  ThumbDown as ThumbDownFilledIcon,
  Refresh as RefreshIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { copyToClipboard } from '@/utils/string.utils';

interface MessageActionsProps {
  content: string;
  role: 'user' | 'assistant';
  onRegenerate?: () => void;
  onEdit?: () => void;
  onLikeToggle?: () => void;
  onDislikeToggle?: () => void;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  role,
  onRegenerate,
  onEdit,
  onLikeToggle,
  onDislikeToggle,
  isLiked,
  isDisliked,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box
      className="message-action-bar"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.5,
        mt: 1,
        opacity: 0.85,
        transition: 'opacity 0.2s ease',
        '&:hover': { opacity: 1 },
      }}
    >
      {/* Copy Button */}
      <AppTooltip title={copied ? 'Copied!' : 'Copy message'}>
        <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5, color: 'text.secondary' }}>
          {copied ? (
            <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
          ) : (
            <CopyIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </AppTooltip>

      {role === 'user' && onEdit && (
        <AppTooltip title="Edit and resend">
          <IconButton size="small" onClick={onEdit} sx={{ p: 0.5, color: 'text.secondary' }}>
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </AppTooltip>
      )}

      {role === 'assistant' && (
        <>
          {onRegenerate && (
            <AppTooltip title="Regenerate response">
              <IconButton size="small" onClick={onRegenerate} sx={{ p: 0.5, color: 'text.secondary' }}>
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </AppTooltip>
          )}

          {onLikeToggle && (
            <AppTooltip title="Helpful response">
              <IconButton
                size="small"
                onClick={onLikeToggle}
                sx={{
                  p: 0.5,
                  color: isLiked ? 'primary.main' : 'text.secondary',
                }}
              >
                {isLiked ? <ThumbUpFilledIcon sx={{ fontSize: 16 }} /> : <ThumbUpIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </AppTooltip>
          )}

          {onDislikeToggle && (
            <AppTooltip title="Poor response">
              <IconButton
                size="small"
                onClick={onDislikeToggle}
                sx={{
                  p: 0.5,
                  color: isDisliked ? 'error.main' : 'text.secondary',
                }}
              >
                {isDisliked ? <ThumbDownFilledIcon sx={{ fontSize: 16 }} /> : <ThumbDownIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </AppTooltip>
          )}
        </>
      )}
    </Box>
  );
};
