import axios from 'axios';
import AuthService from './authService';

const api = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = AuthService.getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const skipInterceptorUrls = ['/login', '/refresh'];
    const isSkippedUrl = skipInterceptorUrls.some((url) =>
      originalRequest.url.includes(url),
    );
    if (isSkippedUrl) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount >= 2) {
        AuthService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      originalRequest._retryCount += 1;

      delete axios.defaults.headers.common.Authorization;
      try {
        const newToken = await AuthService.refreshToken();
        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axios(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
