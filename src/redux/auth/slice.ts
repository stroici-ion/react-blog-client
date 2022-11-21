import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StatusType } from '../posts/types';
import {
  fetchLogin,
  fetchRefresh,
  fetchRegister,
  fetchUpdate,
} from './asyncActions';
import { IUserState } from './types';

const initialState: IUserState = {
  data: null,
  error: null,
  status: StatusType.LOADING,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.data = null;
      state.status = StatusType.LOADING;
    },
  },
  extraReducers: (builder) => {
    //Login
    builder.addCase(fetchLogin.pending, (state) => {
      state.data = null;
      state.status = StatusType.LOADING;
    });
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.data = null;
      state.error = action.payload;
      state.status = StatusType.ERROR;
    });
    //Me
    builder.addCase(fetchRefresh.pending, (state) => {
      state.data = null;
      state.status = StatusType.LOADING;
    });
    builder.addCase(fetchRefresh.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchRefresh.rejected, (state) => {
      state.data = null;
      state.status = StatusType.ERROR;
    });
    //Update
    builder.addCase(fetchUpdate.pending, (state) => {
      state.data = null;
      state.status = StatusType.LOADING;
    });
    builder.addCase(fetchUpdate.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchUpdate.rejected, (state) => {
      state.data = null;
      state.status = StatusType.ERROR;
    });
    //Register
    builder.addCase(fetchRegister.pending, (state) => {
      state.data = null;
      state.status = StatusType.LOADING;
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.data = null;
      state.error = action.payload;
      state.status = StatusType.ERROR;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
