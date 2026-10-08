import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '@/constants';
import type { ApiError } from './api.types';

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const requestErrorInterceptor = (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
  const customError: ApiError = {
    message: 'An unexpected network error occurred.',
    status: error.response?.status,
    code: error.code,
  };

  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>;
    if (typeof data.message === 'string') {
      customError.message = data.message;
    }
  }

  if (error.response?.status === 401) {
    // Unauthorized handler
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  return Promise.reject(customError);
};
