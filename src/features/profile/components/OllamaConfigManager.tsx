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
  Help as HelpIcon,
  Storage as ModelsIcon,
} from '@mui/icons-material';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { profileService } from '../services/profile.service';
import type { OllamaConfig, TestOllamaResult } from '../types/profile.types';

export const OllamaConfigManager: React.FC = () => {
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
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
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
    <Stack spacing={3}>
      {/* Main Configuration Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CloudIcon color="primary" sx={{ fontSize: 24 }} />
                Ollama & Cloudflare Tunnel Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Connect your local Ollama models or remote Cloudflare Tunnel dynamically without restarting backend servers.
              </Typography>
            </Box>

            <Tooltip title="Refresh Status">
              <IconButton onClick={loadConfig} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Indicator Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '12px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              border: '1px solid',
              borderColor: isConnected ? 'success.main' : 'error.main',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isConnected ? (
                <ConnectedIcon sx={{ color: 'success.main', fontSize: 22 }} />
              ) : (
                <ErrorIcon sx={{ color: 'error.main', fontSize: 22 }} />
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {isConnected ? 'Endpoint Connected & Ready' : 'Endpoint Offline / Unreachable'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Target: <strong>{testResult?.url || config?.url || 'http://127.0.0.1:11434'}</strong>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {latency !== undefined && latency > 0 && (
                <Chip
                  icon={<SpeedIcon sx={{ fontSize: 16 }} />}
                  label={`${latency} ms`}
                  size="small"
                  variant="outlined"
                  color={latency < 300 ? 'success' : 'warning'}
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip
                icon={<ModelsIcon sx={{ fontSize: 16 }} />}
                label={`${models.length} Model${models.length === 1 ? '' : 's'}`}
                size="small"
                color={isConnected ? 'primary' : 'default'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Paper>

          {/* URL Input Form */}
          <Stack spacing={2.5}>
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
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                Quick Presets:
              </Typography>
              <Chip
                icon={<LocalIcon sx={{ fontSize: 14 }} />}
                label="Localhost (127.0.0.1:11434)"
                size="small"
                onClick={() => handleSetPreset('http://127.0.0.1:11434')}
                clickable
                sx={{ borderRadius: '8px' }}
              />
              <Chip
                icon={<CloudIcon sx={{ fontSize: 14 }} />}
                label="Cloudflare Tunnel Template"
                size="small"
                onClick={() => handleSetPreset('https://your-tunnel.trycloudflare.com')}
                clickable
                sx={{ borderRadius: '8px' }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
              <AppButton
                variant="outlined"
                onClick={handleTestConnection}
                loading={isTesting}
                disabled={!urlInput.trim() || isSaving}
              >
                Test Connection
              </AppButton>
              <AppButton
                variant="contained"
                onClick={handleSaveEndpoint}
                loading={isSaving}
                disabled={!urlInput.trim() || isTesting}
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
            <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ModelsIcon sx={{ fontSize: 18 }} />
                Active Models Available on this Endpoint ({models.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {models.map((m) => (
                  <Chip
                    key={m.name}
                    label={m.name}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600, borderRadius: '8px', py: 0.5 }}
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
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setShowGuide((prev) => !prev)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TerminalIcon color="primary" sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                How to Expose Local Ollama via Cloudflare Tunnel
              </Typography>
            </Box>
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Box>

          <Collapse in={showGuide} sx={{ mt: 2 }}>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              To let Render, Vercel, or mobile devices connect to your PC's GPU-powered Ollama for free without port forwarding:
            </Typography>

            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Step 1: Start your local Ollama
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    mt: 0.5,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa'),
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                  }}
                >
                  ollama serve
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Step 2: Start Cloudflare Tunnel on port 11434
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    mt: 0.5,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa'),
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <code>cloudflared tunnel --url http://localhost:11434</code>
                  <Tooltip title={copiedCmd ? 'Copied!' : 'Copy Command'}>
                    <IconButton size="small" onClick={handleCopyTunnelCmd}>
                      {copiedCmd ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Step 3: Copy the generated Tunnel URL & Paste above
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Look for the URL ending with <code>.trycloudflare.com</code> in your terminal, paste it in the field above, and click <strong>Save & Apply Endpoint</strong>.
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
