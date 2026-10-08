import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import type { User } from '@/types';
import type {
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  VerifyOtpPayload,
  ResendOtpPayload,
  LoginResult,
} from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (credentials: RegisterCredentials) => Promise<RegisterResponse>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  resendOtp: (payload: ResendOtpPayload) => Promise<{ success: boolean; message: string; devOtp?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to initialize auth', e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResult> => {
      setIsLoading(true);
      try {
        const response = await authService.login(credentials);
        if (response.user) {
          setUser(response.user);
          navigate('/chat');
        }
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
      setIsLoading(true);
      try {
        return await authService.register(credentials);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload) => {
      setIsLoading(true);
      try {
        const response = await authService.verifyOtp(payload);
        setUser(response.user);
        navigate('/chat');
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const resendOtp = useCallback(async (payload: ResendOtpPayload) => {
    return await authService.resendOtp(payload);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedData };
      storage.set(STORAGE_KEYS.USER_DATA, next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

