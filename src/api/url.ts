import { apiClient } from './client';
import type { ShortUrl, PaginatedResponse } from '@/types';

export const getUrlList = (url?: string) =>
    apiClient.get<PaginatedResponse<ShortUrl>>(url ?? '/api/short-urls/');
    
export const deleteUrl = (id: number) => apiClient.delete<void>(`/api/short-urls/${id}/`);

export const postUrl = (original_url: string, idempotencyKey: string) => apiClient.post<ShortUrl>('/api/short-urls/', { original_url }, { headers: { 'Idempotency-Key': idempotencyKey } })