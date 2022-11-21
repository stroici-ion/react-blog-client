import axios, { AxiosRequestConfig } from 'axios';
import { API_URL } from './utils/consts';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: window.localStorage.getItem('token'),
    },
  };
});

export default instance;
