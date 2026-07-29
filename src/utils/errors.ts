import { AxiosError } from 'axios';

interface ParseApiErrorResult {
    fieldErrors: Record<string, string> | null;
    generalError: string | null;
}

export function parseApiError(
    err: unknown,
    fallbackMessage = 'Terjadi kesalahan, silakan coba lagi nanti.'
): ParseApiErrorResult {
    const data = (err as AxiosError)?.response?.data as any;

    if (data && typeof data === 'object' && !data.detail) {
        const flat: Record<string, string> = {};
        Object.entries(data).forEach(([key, msgs]) => {
            flat[key] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        });
        return { fieldErrors: flat, generalError: null };
    }

    return { fieldErrors: null, generalError: data?.detail ?? fallbackMessage };
}