import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient, setAccessTokenRef, setOnAuthExpired } from '../client';

let refreshCallCount = 0;

const server = setupServer(
    http.get('*/api/short-urls/', ({ request }) => {
        const auth = request.headers.get('Authorization');
        if (auth === 'Bearer new-token') {
            return HttpResponse.json({
                count: 0,
                next: null,
                previous: null,
                results: [],
            });
        }
        return new HttpResponse(null, { status: 401 });
    }),

    http.post('*/api/auth/token/refresh/', () => {
        refreshCallCount++;
        return HttpResponse.json({ access: 'new-token' });
    })
);

beforeEach(() => {
    server.listen();
    refreshCallCount = 0;
    setAccessTokenRef('expired-token');
});

afterEach(() => {
    server.resetHandlers();
    server.close();
});

describe('interceptor refresh token', () => {
    it('refreshes once and retries a single failing request', async () => {
        const res = await apiClient.get('/api/short-urls/');

        expect(res.status).toBe(200);
        expect(refreshCallCount).toBe(1);
    });

    it('only refreshes once when two requests fail at the same time', async () => {
        const [res1, res2] = await Promise.all([
            apiClient.get('/api/short-urls/'),
            apiClient.get('/api/short-urls/'),
        ]);

        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        expect(refreshCallCount).toBe(1);
    });

    it('rejects queued requests when refresh itself fails', async () => {
        server.use(
            http.post('*/api/auth/token/refresh/', () => {
                refreshCallCount++;
                return new HttpResponse(null, { status: 401 });
            })
        );

        const onAuthExpired = vi.fn();
        setOnAuthExpired(onAuthExpired);

        const results = await Promise.allSettled([
            apiClient.get('/api/short-urls/'),
            apiClient.get('/api/short-urls/'),
        ]);

        expect(results[0].status).toBe('rejected');
        expect(results[1].status).toBe('rejected');
        expect(refreshCallCount).toBe(1);

        expect(onAuthExpired).toHaveBeenCalledTimes(1);
    });
});
