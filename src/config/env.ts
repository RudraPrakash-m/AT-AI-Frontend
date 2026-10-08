export const env = {
  NODE_ENV: import.meta.env.MODE || 'development',
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL || '/api').trim(),
  BACKEND_URL: (import.meta.env.VITE_BACKEND_URL || '').trim(),
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AT AI',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

/**
 * Resolves full API URL dynamically in both development and production (Netlify):
 * - If VITE_BACKEND_URL is set (e.g., https://my-backend.onrender.com or Cloudflare tunnel),
 *   it maps /api/* directly to the backend URL when hosted in production or non-localhost.
 * - In local dev with Vite proxy, it keeps /api/* as relative URL.
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (env.BACKEND_URL && env.BACKEND_URL.startsWith('http')) {
    const isRemoteBackend =
      !env.BACKEND_URL.includes('localhost') && !env.BACKEND_URL.includes('127.0.0.1');

    const isClientProd =
      env.NODE_ENV === 'production' ||
      (typeof window !== 'undefined' &&
        !window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('127.0.0.1'));

    if (isRemoteBackend || isClientProd) {
      const base = env.BACKEND_URL.replace(/\/+$/, '');
      return `${base}${cleanEndpoint}`;
    }
  }

  return cleanEndpoint;
};


