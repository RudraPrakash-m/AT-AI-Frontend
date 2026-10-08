import type { User } from '@/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
  devOtp?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface LoginResult {
  success?: boolean;
  token?: string;
  user?: User;
  requireVerification?: boolean;
  email?: string;
  message?: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
