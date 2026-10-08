import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowUpward as SendIcon,
  AttachFile as AttachIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Language as WebSearchIcon,
  Psychology as ThinkIcon,
  Stop as StopIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import type { ChatAttachment } from '../types/chat.types';

interface ChatInputProps {
  onSendMessage: (payload: {
    message: string;
    attachments: ChatAttachment[];
    useWebSearch: boolean;
    useDeepThinking: boolean;
  }) => void;
  onStopStreaming?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  disabled = false,
  placeholder = 'Ask AT AI anything... (Press Enter to send, Shift + Enter for new line)',
  initialValue = '',
}) => {
  const [inputMessage, setInputMessage] = useState(initialValue);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useDeepThinking, setUseDeepThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    if (initialValue) {
      setInputMessage(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  const isSubmittingRef = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (
      (!inputMessage.trim() && attachments.length === 0) ||
      disabled ||
      isStreaming ||
      isSubmittingRef.current
    ) {
      return;
    }

    isSubmittingRef.current = true;
    const text = inputMessage.trim();
    const currentAttachments = [...attachments];

    setInputMessage('');
    setAttachments([]);

    onSendMessage({
      message: text,
      attachments: currentAttachments,
      useWebSearch,
      useDeepThinking,
    });

    // Reset submitting guard on next tick
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 300);
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        const reader = new FileReader();
        reader.onload = () => {
          const resultStr = reader.result as string;
          const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

          const newAttachment: ChatAttachment = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            url: resultStr,
            base64: base64Data,
          };

          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const textData = reader.result as string;
          const newAttachment: ChatAttachment = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            textContent: textData,
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const resultStr = reader.result as string;
            const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

            const newAttachment: ChatAttachment = {
              id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: `Pasted_Image_${Date.now()}.png`,
              size: file.size,
              type: file.type,
              url: resultStr,
              base64: base64Data,
            };

            setAttachments((prev) => [...prev, newAttachment]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputMessage((prev) =>
          prev
            ? `${prev} How can I optimize memory allocation in Node.js microservices?`
            : 'How can I optimize memory allocation in Node.js microservices?'
        );
        setIsRecording(false);
      }, 2400);
    } else {
      setIsRecording(false);
    }
  };

  const hasContent = inputMessage.trim().length > 0 || attachments.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 820,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3 },
        pt: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: '20px',
          bgcolor: isDark ? 'rgba(19, 27, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          boxShadow: isDark
            ? '0 12px 32px -4px rgba(0, 0, 0, 0.5)'
            : '0 12px 32px -4px rgba(37, 99, 235, 0.08)',
          transition: 'border-color 0.15s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
          },
        }}
      >
        {/* Attachment chips / Image thumbnails */}
        {attachments.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 1.25, px: 0.5, flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((file) => (
              <Box
                key={file.id}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 0.5,
                  pr: 1,
                  borderRadius: '10px',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                }}
              >
                {file.url ? (
                  <Box
                    component="img"
                    src={file.url}
                    alt={file.name}
                    sx={{ width: 36, height: 36, borderRadius: '6px', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '6px',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    DOC
                  </Box>
                )}

                <Box sx={{ maxWidth: 160 }}>
                  <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600, fontSize: '0.75rem' }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>

                <IconButton size="small" onClick={() => removeAttachment(file.id)} sx={{ p: 0.25, ml: 0.5 }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}

        {/* Input Textarea with onPaste image support */}
        <InputBase
          inputRef={textareaRef}
          multiline
          minRows={1}
          maxRows={7}
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={isRecording ? 'Listening to voice...' : placeholder}
          disabled={disabled || isStreaming}
          sx={{
            px: 1,
            py: 0.5,
            fontSize: '0.94rem',
            lineHeight: 1.55,
            color: 'text.primary',
            '& textarea': {
              resize: 'none',
            },
          }}
        />

        {/* Bottom Controls Bar */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            pt: 0.5,
          }}
        >
          {/* Left tools: Attachment, Search, Think Mode */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              multiple
            />

            <AppTooltip title="Attach files (Docs, Images, Code)">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isStreaming}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <AttachIcon fontSize="small" />
              </IconButton>
            </AppTooltip>

            {/* Web Search Toggle */}
            <AppTooltip title={useWebSearch ? 'Web search enabled' : 'Enable live web search'}>
              <IconButton
                size="small"
                onClick={() => setUseWebSearch((prev) => !prev)}
                sx={{
                  color: useWebSearch ? 'primary.main' : 'text.secondary',
                  bgcolor: useWebSearch ? 'action.selected' : 'transparent',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <WebSearchIcon fontSize="small" />
              </IconButton>
            </AppTooltip>

            {/* Think Mode Toggle (deep reasoning) */}
            <AppTooltip title={useDeepThinking ? 'Deep Reasoning enabled' : 'Enable Deep Reasoning (Chain of Thought)'}>
              <IconButton
                size="small"
                onClick={() => setUseDeepThinking((prev) => !prev)}
                sx={{
                  color: useDeepThinking ? '#8B5CF6' : 'text.secondary',
                  bgcolor: useDeepThinking ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                  '&:hover': { color: '#8B5CF6' },
                }}
              >
                <ThinkIcon fontSize="small" />
              </IconButton>
            </AppTooltip>
          </Stack>

          {/* Right tools: Voice Recording & Send / Stop Button */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AppTooltip title={isRecording ? 'Stop listening' : 'Voice input'}>
              <IconButton
                size="small"
                onClick={toggleVoiceRecording}
                sx={{
                  color: isRecording ? 'error.main' : 'text.secondary',
                  animation: isRecording ? 'pulse 1s infinite' : 'none',
                }}
              >
                {isRecording ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
              </IconButton>
            </AppTooltip>

            {isStreaming ? (
              <AppTooltip title="Stop generation">
                <IconButton
                  size="small"
                  onClick={onStopStreaming}
                  sx={{
                    bgcolor: 'error.main',
                    color: '#FFFFFF',
                    width: 34,
                    height: 34,
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                >
                  <StopIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </AppTooltip>
            ) : (
              <AppTooltip title="Send message (Enter)">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleSubmit}
                    disabled={!hasContent || disabled}
                    sx={{
                      bgcolor: hasContent ? 'primary.main' : 'action.disabledBackground',
                      color: hasContent ? '#FFFFFF' : 'text.disabled',
                      width: 34,
                      height: 34,
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: hasContent ? 'primary.dark' : 'action.disabledBackground',
                        transform: hasContent ? 'scale(1.05)' : 'none',
                      },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </AppTooltip>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Subtle footer notice */}
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{
          display: 'block',
          textAlign: 'center',
          fontSize: '0.72rem',
          mt: 1,
        }}
      >
        AT AI can make mistakes. Verify critical code and architectural decisions.
      </Typography>
    </Box>
  );
};
