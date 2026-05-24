import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:3001/api/v1';
const API_TIMEOUT_MS = 10_000;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
  timeout: API_TIMEOUT_MS,
});

api.interceptors.request.use((config) => {
  config.headers.set('X-Requested-With', 'XMLHttpRequest');

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(error),
);
