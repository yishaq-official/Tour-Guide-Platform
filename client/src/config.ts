export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
