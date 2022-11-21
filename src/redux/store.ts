import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import posts from './posts/slice';
import auth from './auth/slice';
import search from './search/slice';
import fullPost from './fullPost/slice';

const store = configureStore({
  reducer: { posts, auth, search, fullPost },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
