import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IFullPostState } from './types';
import { PostType } from '../../models/PostModel';

const initialState: IFullPostState = {
  post: undefined,
  isVisible: false,
  selectedImageId: '',
};

const fullPostSlice = createSlice({
  name: 'fullPost',
  initialState,
  reducers: {
    setPost(
      state,
      action: PayloadAction<{
        post: PostType;
        imageId: string;
      }>
    ) {
      state.post = action.payload.post;
      state.selectedImageId = action.payload.imageId;
      state.isVisible = true;
    },
    showFullPost(state) {
      state.isVisible = true;
    },
    hideFullPost(state) {
      state.isVisible = false;
    },
  },
});

export default fullPostSlice.reducer;

export const { setPost, showFullPost, hideFullPost } = fullPostSlice.actions;
