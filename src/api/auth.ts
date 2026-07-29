import { apiClient } from './client';
import type { RegisterRequest, AuthResponse, OTPRequest, LoginReques, ResendOTPRequest } from '@/types';

export const register = (data: RegisterRequest) =>
  apiClient.post<{token: string}>('/api/auth/register/', data);

export const otp = (data: OTPRequest) => apiClient.post<{message: string}>('/api/auth/verify-otp/', data)

export const resend = (data: ResendOTPRequest) => apiClient.post<{void}>('/api/auth/resend-otp/', data)

export const login = (data: LoginRequest) =>
  apiClient.post<AuthResponse>('/api/auth/login/', data);

export const logout = () =>
  apiClient.post('/api/auth/logout/');