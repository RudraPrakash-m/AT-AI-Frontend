export interface UserSettings {
  themeMode: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  sendOnEnter: boolean;
  codeHighlighting: boolean;
  streamResponses: boolean;
  defaultModel: string;
  temperature: number;
  topP: number;
  systemPrompt: string;
  enableTelemetry: boolean;
  enableMemory: boolean;
  soundEffects: boolean;
}
