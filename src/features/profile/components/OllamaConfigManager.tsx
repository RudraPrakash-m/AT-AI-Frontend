import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Collapse,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  CloudQueue as CloudIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Terminal as TerminalIcon,
  Computer as LocalIcon,
  HelpOutlineRounded as HelpIcon,
  Storage as ModelsIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { profileService } from '../services/profile.service';
import type { OllamaConfig, TestOllamaResult } from '../types/profile.types';

export const OllamaConfigManager: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [config, setConfig] = useState<OllamaConfig | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<TestOllamaResult | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getOllamaConfig();
      setConfig(data);
      setUrlInput(data.url || 'http://127.0.0.1:11434');
      setTestResult(data);
    } catch (err) {
      console.error('Failed to load Ollama config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleTestConnection = async () => {
    if (!urlInput.trim()) return;
    try {
      setIsTesting(true);
      const result = await profileService.testOllamaEndpoint(urlInput.trim());
      setTestResult(result);
      if (result.connected) {
        setToastMessage(`Connected successfully! Found ${result.models.length} model(s). (${result.latencyMs}ms)`);
        setToastSeverity('success');
      } else {
        setToastMessage(result.error || 'Connection failed.');
        setToastSeverity('error');
      }
    } catch (err: any) {
      setToastMessage(err.message || 'Error testing connection.');
      setToastSeverity('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveEndpoint = async () => {
    if (!urlInput.trim()) return;
    try {
      setIsSaving(true);
      const result = await profileService.updateOllamaConfig(urlInput.trim());
      setConfig(result);
      setTestResult(result);
      setToastMessage('Ollama endpoint saved and applied successfully!');
      setToastSeverity('success');
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to save endpoint.');
      setToastSeverity('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
  };

  const handleCopyTunnelCmd = () => {
    navigator.clipboard.writeText('cloudflared tunnel --url http://localhost:11434');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (isLoading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: '14px', sm: '18px' },
          border: '1px solid',
          borderColor: isDark ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.14)',
          bgcolor: isDark ? '#0C1424' : '#FFFFFF',
          p: 6,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={32} />
      </Card>
    );
  }

  const isConnected = testResult ? testResult.connected : Boolean(config?.connected);
  const models = testResult?.models || config?.models || [];
  const latency = testResult?.latencyMs ?? config?.latencyMs;

  return (
    <Stack spacing={{ xs: 2.5, sm: 3 }}>
      {/* Main Configuration Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: '14px', sm: '18px' },
          border: '1px solid',
          borderColor: isDark ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.14)',
          bgcolor: isDark ? '#0C1424' : '#FFFFFF',
          boxShadow: isDark
            ? '0 12px 36px -8px rgba(0, 0, 0, 0.7)'
            : '0 12px 36px -8px rgba(2, 132, 199, 0.08)',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.75, md: 3 } }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  fontSize: { xs: '1.05rem', sm: '1.2rem' },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.1)',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CloudIcon sx={{ fontSize: 20 }} />
                </Box>
                Ollama & Cloudflare Tunnel Configuration
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Connect your local Ollama models or remote Cloudflare Tunnel dynamically without restarting backend servers.
              </Typography>
            </Box>

            <Tooltip title="Refresh Status">
              <IconButton
                onClick={loadConfig}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(0, 163, 255, 0.2)' : 'rgba(2, 132, 199, 0.16)',
                  bgcolor: isDark ? 'rgba(0, 163, 255, 0.05)' : 'rgba(2, 132, 199, 0.04)',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.08)',
                  },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Indicator Bar */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 2.75,
              borderRadius: '12px',
              background: isConnected
                ? isDark
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 163, 255, 0.04) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.04) 100%)'
                : isDark
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(239, 68, 68, 0.05)',
              border: '1px solid',
              borderColor: isConnected
                ? isDark
                  ? 'rgba(16, 185, 129, 0.4)'
                  : 'rgba(16, 185, 129, 0.35)'
                : isDark
                  ? 'rgba(239, 68, 68, 0.4)'
                  : 'rgba(239, 68, 68, 0.3)',
              boxShadow: isConnected
                ? '0 4px 18px rgba(16, 185, 129, 0.08)'
                : 'none',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.75,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              {isConnected ? (
                <ConnectedIcon sx={{ color: '#10B981', fontSize: 22, flexShrink: 0 }} />
              ) : (
                <ErrorIcon sx={{ color: '#EF4444', fontSize: 22, flexShrink: 0 }} />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.88rem', sm: '0.94rem' } }}>
                  {isConnected ? 'Endpoint Connected & Ready' : 'Endpoint Offline / Unreachable'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    wordBreak: 'break-all',
                    display: 'block',
                    mt: 0.25,
                    fontSize: { xs: '0.72rem', sm: '0.78rem' },
                  }}
                >
                  Target: <strong>{testResult?.url || config?.url || 'http://127.0.0.1:11434'}</strong>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flexShrink: 0 }}>
              {latency !== undefined && latency > 0 && (
                <Chip
                  icon={<SpeedIcon sx={{ fontSize: '14px !important', color: '#F59E0B !important' }} />}
                  label={`${latency} ms`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.08)',
                    color: '#F59E0B',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                  }}
                />
              )}
              <Chip
                icon={<ModelsIcon sx={{ fontSize: '14px !important', color: '#FFFFFF !important' }} />}
                label={`${models.length} Model${models.length === 1 ? '' : 's'}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  background: isConnected
                    ? 'linear-gradient(135deg, #00A3FF 0%, #0284C7 100%)'
                    : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: isConnected ? '0 2px 8px rgba(0, 163, 255, 0.35)' : 'none',
                }}
              />
            </Box>
          </Paper>

          {/* URL Input Form */}
          <Stack spacing={2.25}>
            <AppInput
              label="Ollama / Cloudflare Tunnel URL"
              placeholder="e.g. https://your-tunnel.trycloudflare.com or http://127.0.0.1:11434"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              fullWidth
              helperText="Enter the public Cloudflare Tunnel URL (for Render/Production) or local IP."
            />

            {/* Quick Preset Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontWeight: 600 }}>
                Quick Presets:
              </Typography>
              <Chip
                icon={<LocalIcon sx={{ fontSize: '14px !important', color: isDark ? '#38BDF8' : '#0284C7' }} />}
                label="Localhost (127.0.0.1:11434)"
                size="small"
                onClick={() => handleSetPreset('http://127.0.0.1:11434')}
                clickable
                sx={{
                  borderRadius: '8px',
                  bgcolor: isDark ? 'rgba(0, 163, 255, 0.08)' : 'rgba(2, 132, 199, 0.06)',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(0, 163, 255, 0.2)' : 'rgba(2, 132, 199, 0.16)',
                  fontWeight: 600,
                  fontSize: '0.74rem',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.12)',
                    borderColor: 'primary.main',
                  },
                }}
              />
              <Chip
                icon={<CloudIcon sx={{ fontSize: '14px !important', color: '#F59E0B' }} />}
                label="Cloudflare Tunnel Template"
                size="small"
                onClick={() => handleSetPreset('https://your-tunnel.trycloudflare.com')}
                clickable
                sx={{
                  borderRadius: '8px',
                  bgcolor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.18)',
                  fontWeight: 600,
                  fontSize: '0.74rem',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                    borderColor: 'secondary.main',
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'flex-end',
                gap: 1.5,
                pt: 1,
              }}
            >
              <AppButton
                variant="outlined"
                onClick={handleTestConnection}
                loading={isTesting}
                disabled={!urlInput.trim() || isSaving}
                sx={{
                  fontWeight: 600,
                  borderColor: isDark ? 'rgba(0, 163, 255, 0.25)' : 'rgba(2, 132, 199, 0.25)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: isDark ? 'rgba(0, 163, 255, 0.08)' : 'rgba(2, 132, 199, 0.06)',
                  },
                }}
              >
                Test Connection
              </AppButton>
              <AppButton
                variant="contained"
                onClick={handleSaveEndpoint}
                loading={isSaving}
                disabled={!urlInput.trim() || isTesting}
                sx={{
                  fontWeight: 700,
                  background: isDark
                    ? 'linear-gradient(135deg, #00A3FF 0%, #0284C7 100%)'
                    : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  boxShadow: isDark
                    ? '0 4px 14px rgba(0, 163, 255, 0.35)'
                    : '0 4px 14px rgba(2, 132, 199, 0.25)',
                }}
              >
                Save & Apply Endpoint
              </AppButton>
            </Box>
          </Stack>

          {/* Error Details */}
          {!isConnected && testResult?.error && (
            <Alert severity="warning" sx={{ mt: 3, borderRadius: '10px' }}>
              {testResult.error}
            </Alert>
          )}

          {/* Discovered Models List */}
          {isConnected && models.length > 0 && (
            <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid', borderColor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.12)' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                }}
              >
                <ModelsIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                Active Models Available on this Endpoint ({models.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {models.map((m) => (
                  <Chip
                    key={m.name}
                    label={m.name}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '8px',
                      py: 0.5,
                      px: 0.5,
                      fontSize: '0.76rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      bgcolor: isDark ? 'rgba(0, 163, 255, 0.1)' : 'rgba(2, 132, 199, 0.08)',
                      color: isDark ? '#38BDF8' : '#0284C7',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(0, 163, 255, 0.25)' : 'rgba(2, 132, 199, 0.2)',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Cloudflare Tunnel Quick Guide Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: '14px', sm: '18px' },
          border: '1px solid',
          borderColor: isDark ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.14)',
          bgcolor: isDark ? '#0C1424' : '#FFFFFF',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.75, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => setShowGuide((prev) => !prev)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.1)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <TerminalIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                How to Expose Local Ollama via Cloudflare Tunnel
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                transition: 'transform 0.2s ease',
                transform: showGuide ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>

          <Collapse in={showGuide} sx={{ mt: 1 }}>
            <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.12)' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
              To connect Render, Vercel, or any remote device to your PC&apos;s local Ollama instance securely for free without port forwarding:
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.5 }}>
                  Step 1: Start your local Ollama instance
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: isDark ? '#070D18' : '#F1F6FB',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.84rem',
                    borderRadius: '8px',
                    color: isDark ? '#38BDF8' : '#0284C7',
                  }}
                >
                  ollama serve
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.5 }}>
                  Step 2: Start Cloudflare Tunnel pointing to port 11434
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: isDark ? '#070D18' : '#F1F6FB',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.84rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <code style={{ color: isDark ? '#F8FAFC' : '#0F172A', wordBreak: 'break-all' }}>
                    cloudflared tunnel --url http://localhost:11434
                  </code>
                  <Tooltip title={copiedCmd ? 'Copied!' : 'Copy Command'}>
                    <IconButton
                      size="small"
                      onClick={handleCopyTunnelCmd}
                      sx={{
                        p: 0.5,
                        color: copiedCmd ? 'success.main' : 'text.secondary',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      {copiedCmd ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.5 }}>
                  Step 3: Copy the generated Tunnel URL & Paste above
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Look for the URL ending with <code style={{ color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 600 }}>.trycloudflare.com</code> in your terminal output, paste it in the field above, and click <strong>Save & Apply Endpoint</strong>.
                </Typography>
              </Box>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* Notification Toast */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} sx={{ borderRadius: '10px' }} onClose={() => setToastMessage(null)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};