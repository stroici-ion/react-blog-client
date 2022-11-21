import { RootState } from '../store';

export const selectIsFullPostVisible = (state: RootState) =>
  state.fullPost.isVisible;

export const selectPost = (state: RootState) => state.fullPost.post;
export const selectSelectedImageId = (state: RootState) =>
  state.fullPost.selectedImageId;
