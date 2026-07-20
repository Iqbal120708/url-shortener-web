import { apiClient } from './client';
import type { RegisterRequest, LoginRequest, RegisterResponse } from '@/types';

export const register = (data: RegisterRequest) =>
  apiClient.post<RegisterResponse>('/api/auth/register/', data);

export const login = (data: LoginRequest) =>
  apiClient.post<AuthResponse>('/api/auth/login/', data);

export const logout = () =>
  apiClient.post('/api/auth/logout/');