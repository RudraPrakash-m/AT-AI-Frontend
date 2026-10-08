export const env = {
  NODE_ENV: import.meta.env.MODE || 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AT AI',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

