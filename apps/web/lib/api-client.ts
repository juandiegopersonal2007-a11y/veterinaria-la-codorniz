import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Only set up interceptors if we're in the browser (client-side)
if (typeof window !== 'undefined') {
  // Inject auth token into every request
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Track whether a refresh is already in progress to avoid infinite loops
  let isRefreshing = false;
  let refreshSubscribers: Array<(token: string) => void> = [];

  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
  };

  // Handle 401: try to refresh token once, then retry the original request
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the failed request is the refresh endpoint itself, bail out — don't loop
      if (originalRequest?.url?.includes('/auth/refresh')) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('user');
        document.cookie = 'auth-token=; path=/; max-age=0';
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh-token');

        if (!refreshToken) {
          // No refresh token available, redirect to login
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user');
          document.cookie = 'auth-token=; path=/; max-age=0';
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Queue this request until the refresh completes
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const { data } = await apiClient.post('/auth/refresh', { refreshToken });
          const newToken: string = data.token;
          const newRefreshToken: string = data.refreshToken;

          // Persist new tokens
          localStorage.setItem('auth-token', newToken);
          localStorage.setItem('refresh-token', newRefreshToken);
          document.cookie = `auth-token=${newToken}; path=/; max-age=${8 * 60 * 60}`;

          // Retry all queued requests with the new token
          onRefreshed(newToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed — force logout
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
          localStorage.removeItem('user');
          document.cookie = 'auth-token=; path=/; max-age=0';
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export { apiClient };
