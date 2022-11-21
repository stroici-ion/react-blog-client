import { RootState } from '../store';

export const selectUserData = (state: RootState) => state.auth.data?.user;
export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);
export const selectUserAuthStatus = (state: RootState) => state.auth.status;
export const selectUser = (state: RootState) => state.auth;
