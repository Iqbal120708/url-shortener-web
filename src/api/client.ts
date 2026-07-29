import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

let accessTokenRef: string | null = null;
let onTokenRefreshed: ((token: string | null) => void) | null = null;

export function setAccessTokenRef(token: string | null) {
    accessTokenRef = token;
}

export function setOnTokenRefreshed(callback: (token: string | null) => void) {
    onTokenRefreshed = callback;
}

apiClient.interceptors.request.use((config) => {
    if (accessTokenRef) {
        config.headers.Authorization = `Bearer ${accessTokenRef}`;
    }
    return config;
});

let isRefreshing = false;
// Queue of "waiters" — each item is a callback to run once the new token is ready
let subscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
    subscribers.forEach((callback) => callback(token));
    subscribers = []; // clear for the next batch
}

apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // A refresh is already in progress — queue this request instead of refreshing again
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribers.push((newToken) => {
                    if (!newToken) {
                        reject(error); // refresh failed, this request fails too
                        return;
                    }
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(apiClient(originalRequest)); // new token ready, retry this request
                });
            });
        }

        // First request to hit 401 — this one drives the refresh
        isRefreshing = true;
        try {
            const res = await refreshClient.post('/api/auth/token/refresh/');
            const newToken = res.data.access;
            setAccessTokenRef(newToken);
            onTokenRefreshed?.(newToken);
            onRefreshed(newToken); // notify everyone waiting in the queue
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            onTokenRefreshed?.(null);
            onRefreshed(null); // notify everyone waiting: failed, no new token
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);