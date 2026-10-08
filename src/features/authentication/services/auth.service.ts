import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import { getApiUrl } from '@/config/env';
import type { User } from '@/types';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RegisterResponse,
  VerifyOtpPayload,
  ResendOtpPayload,
  LoginResult,
  ResetPasswordPayload,
} from '../types/auth.types';

class AuthService {
  private getHeaders(): HeadersInit {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const res = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    return data;
  }

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await fetch(getApiUrl('/api/auth/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'OTP verification failed.');
    }

    if (data.token && data.user) {
      storage.set(STORAGE_KEYS.AUTH_TOKEN, data.token);
      storage.set(STORAGE_KEYS.USER_DATA, data.user);
    }

    return data;
  }

  async resendOtp(payload: ResendOtpPayload): Promise<{ success: boolean; message: string; devOtp?: string }> {
    const res = await fetch(getApiUrl('/api/auth/resend-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend verification code.');
    }

    return data;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 403 && data.requireVerification) {
        return data;
      }
      throw new Error(data.error || 'Login failed.');
    }

    if (data.token && data.user) {
      storage.set(STORAGE_KEYS.AUTH_TOKEN, data.token);
      storage.set(STORAGE_KEYS.USER_DATA, data.user);
    }

    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    if (!token) return null;

    try {
      const res = await fetch(getApiUrl('/api/auth/me'), {
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        this.logout();
        return null;
      }

      const data = await res.json();
      if (data.user) {
        storage.set(STORAGE_KEYS.USER_DATA, data.user);
        return data.user;
      }
    } catch {
      return storage.get<User | null>(STORAGE_KEYS.USER_DATA, null);
    }

    return null;
  }

  async logout(): Promise<void> {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.USER_DATA);
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request password reset.');
    }

    return data;
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await fetch(getApiUrl('/api/auth/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password.');
    }

    return data;
  }
}

export const authService = new AuthService();


