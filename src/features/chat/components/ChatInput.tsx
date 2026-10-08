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
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { Zoom } from '@mui/material';
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
  showScrollBottom?: boolean;
  onScrollToBottom?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  disabled = false,
  placeholder = 'Ask AT AI anything...',
  initialValue = '',
  showScrollBottom = false,
  onScrollToBottom,
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

  // Voice Input (Web Speech API)
  const recognitionRef = useRef<any>(null);

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage((prev) => {
            const prefix = prev.trim() ? `${prev.trim()} ` : '';
            return `${prefix}${transcript}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const hasContent = inputMessage.trim().length > 0 || attachments.length > 0;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 840,
        mx: 'auto',
        flexShrink: 0,
        px: { xs: 1, sm: 2.5, md: 3 },
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 8px)', sm: 2, md: 2.5 },
        pt: { xs: 0.25, sm: 0.5 },
      }}
    >
      {/* Floating Scroll-to-Bottom Button - Perfectly Centered horizontally directly above the input box */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: -42, sm: -50 },
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        <Zoom in={showScrollBottom} unmountOnExit>
          <Box sx={{ pointerEvents: 'auto' }}>
            <AppTooltip title="Scroll to bottom">
              <IconButton
                onClick={onScrollToBottom}
                size="small"
                aria-label="Scroll to bottom"
                sx={{
                  width: { xs: 36, sm: 38 },
                  height: { xs: 36, sm: 38 },
                  borderRadius: '50%',
                  bgcolor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  color: isDark ? '#F1F5F9' : '#1E293B',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.12)',
                  boxShadow: isDark
                    ? '0 6px 20px rgba(0, 0, 0, 0.55)'
                    : '0 6px 20px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isDark ? '#334155' : '#F8FAFC',
                    transform: 'translateY(-2px)',
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0, 0, 0, 0.65)'
                      : '0 8px 24px rgba(0, 0, 0, 0.22)',
                  },
                }}
              >
                <ArrowDownIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />
              </IconButton>
            </AppTooltip>
          </Box>
        </Zoom>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 1.5 },
          borderRadius: { xs: '16px', sm: '20px' },
          bgcolor: isDark ? 'rgba(19, 27, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          boxShadow: isDark
            ? '0 12px 32px -4px rgba(0, 0, 0, 0.5)'
            : '0 12px 32px -4px rgba(2, 132, 199, 0.08)',
          transition: 'border-color 0.15s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
          },
        }}
      >
        {/* Attachment chips / Image thumbnails */}
        {attachments.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 1, px: 0.5, flexWrap: 'wrap', gap: 1 }}>
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
                    sx={{ width: 34, height: 34, borderRadius: '6px', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '6px',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}
                  >
                    DOC
                  </Box>
                )}

                <Box sx={{ maxWidth: { xs: 110, sm: 160 } }}>
                  <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600, fontSize: '0.72rem' }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>

                <IconButton size="small" onClick={() => removeAttachment(file.id)} sx={{ p: 0.25, ml: 0.25 }}>
                  <CloseIcon sx={{ fontSize: 13 }} />
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
          placeholder={
            isRecording
              ? 'Listening to voice...'
              : placeholder || 'Ask AT AI anything...'
          }
          disabled={disabled || isStreaming}
          sx={{
            px: { xs: 0.5, sm: 1 },
            py: 0.5,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            lineHeight: 1.5,
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
            mt: 0.75,
            pt: 0.25,
          }}
        >
          {/* Left tools: Attachment, Search, Think Mode */}
          <Stack direction="row" spacing={{ xs: 0.25, sm: 0.5 }} sx={{ alignItems: 'center' }}>
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
                aria-label="attach file"
                sx={{
                  color: 'text.secondary',
                  width: { xs: 32, sm: 34 },
                  height: { xs: 32, sm: 34 },
                  '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                }}
              >
                <AttachIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </AppTooltip>

            {/* Web Search Toggle */}
            <AppTooltip title={useWebSearch ? 'Web search enabled' : 'Enable live web search'}>
              <IconButton
                size="small"
                onClick={() => setUseWebSearch((prev) => !prev)}
                aria-label="toggle web search"
                sx={{
                  color: useWebSearch ? 'primary.main' : 'text.secondary',
                  bgcolor: useWebSearch ? 'action.selected' : 'transparent',
                  width: { xs: 32, sm: 34 },
                  height: { xs: 32, sm: 34 },
                  '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                <WebSearchIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </AppTooltip>

            {/* Think Mode Toggle (deep reasoning) */}
            <AppTooltip title={useDeepThinking ? 'Deep Reasoning enabled' : 'Enable Deep Reasoning (Chain of Thought)'}>
              <IconButton
                size="small"
                onClick={() => setUseDeepThinking((prev) => !prev)}
                aria-label="toggle reasoning"
                sx={{
                  color: useDeepThinking ? '#8B5CF6' : 'text.secondary',
                  bgcolor: useDeepThinking ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                  width: { xs: 32, sm: 34 },
                  height: { xs: 32, sm: 34 },
                  '&:hover': { color: '#8B5CF6', bgcolor: 'rgba(139, 92, 246, 0.18)' },
                }}
              >
                <ThinkIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </AppTooltip>
          </Stack>

          {/* Right tools: Voice Recording & Send / Stop Button */}
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ alignItems: 'center' }}>
            <AppTooltip title={isRecording ? 'Stop listening' : 'Voice input'}>
              <IconButton
                size="small"
                onClick={toggleVoiceRecording}
                aria-label="voice input"
                sx={{
                  color: isRecording ? 'error.main' : 'text.secondary',
                  width: { xs: 32, sm: 34 },
                  height: { xs: 32, sm: 34 },
                  animation: isRecording ? 'pulse 1s infinite' : 'none',
                  '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                }}
              >
                {isRecording ? (
                  <MicOffIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                ) : (
                  <MicIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                )}
              </IconButton>
            </AppTooltip>

            {isStreaming ? (
              <AppTooltip title="Stop generation">
                <IconButton
                  size="small"
                  onClick={onStopStreaming}
                  aria-label="stop generation"
                  sx={{
                    bgcolor: 'error.main',
                    color: '#FFFFFF',
                    width: { xs: 32, sm: 34 },
                    height: { xs: 32, sm: 34 },
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                >
                  <StopIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </AppTooltip>
            ) : (
              <AppTooltip title="Send message (Enter)">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleSubmit}
                    disabled={!hasContent || disabled}
                    aria-label="send message"
                    sx={{
                      background: hasContent
                        ? (isDark
                            ? 'linear-gradient(135deg, #00A3FF 0%, #0284C7 100%)'
                            : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)')
                        : 'action.disabledBackground',
                      boxShadow: hasContent
                        ? (isDark
                            ? '0 4px 14px rgba(0, 163, 255, 0.45)'
                            : '0 4px 14px rgba(2, 132, 199, 0.35)')
                        : 'none',
                      color: hasContent ? '#FFFFFF' : 'text.disabled',
                      width: { xs: 32, sm: 34 },
                      height: { xs: 32, sm: 34 },
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        opacity: hasContent ? 0.92 : 1,
                        transform: hasContent ? 'scale(1.06)' : 'none',
                      },
                    }}
                  >
                    <SendIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
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
          fontSize: { xs: '0.62rem', sm: '0.72rem' },
          mt: { xs: 0.35, sm: 0.75 },
          px: 1,
          opacity: 0.85,
        }}
      >
        AT AI can make mistakes. Verify important information.
      </Typography>
    </Box>
  );
};
