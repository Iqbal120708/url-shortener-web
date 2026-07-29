import { apiClient } from './client';
import type { ShortUrl, PaginatedResponse } from '@/types';

export const getUrlList = (url?: string) =>
    apiClient.get<PaginatedResponse<ShortUrl>>(url ?? '/api/short-urls/');