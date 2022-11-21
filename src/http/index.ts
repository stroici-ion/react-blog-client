import axios from 'axios';
import { API_URL } from '../utils/consts';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL + '/api',
});

$api.interceptors.request.use((config) => {
  if (config.headers)
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${API_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log('User is not authorized');
      }
    }
    throw error;
  }
);

export default $api;
