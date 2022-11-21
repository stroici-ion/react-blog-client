import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { AuthUserType, RegisterUserType } from '../../models/user.model';
import $api from '../../http';
import { API_URL } from '../../utils/consts';

export const fetchLogin = createAsyncThunk<AuthUserType, Record<string, string>>(
  'aurth/fetchAuth',
  async (params, { rejectWithValue }) => {
    try {
      const response = await $api.post('/auth/login', params);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRegister = createAsyncThunk<AuthUserType, RegisterUserType>(
  'aurth/fetchRegister',
  async (params, { rejectWithValue }) => {
    try {
      const response = await $api.post<AuthUserType>('/auth/registration', params);
      return response.data;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRefresh = createAsyncThunk<AuthUserType>('aurth/fetchAuthMe', async () => {
  const response = await axios.get(`${API_URL}/api/auth/refresh`, {
    withCredentials: true,
  });
  localStorage.setItem('token', response.data.accessToken);
  return response.data;
});

export const fetchUpdate = createAsyncThunk<AuthUserType, FormData>(
  'aurth/fetchUpdate',
  async (params) => {
    const { data } = await $api.post<AuthUserType>('/auth/update', params);
    return data;
  }
);
