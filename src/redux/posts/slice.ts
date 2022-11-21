import { createSlice } from '@reduxjs/toolkit';
import { fetchPosts, fetchRemovePost, fetchTags } from './asyncActions';

import { IPostsState, StatusType } from './types';

const initialState: IPostsState = {
  posts: {
    items: { count: 0, posts: [] },
    status: StatusType.LOADING,
  },
  tags: {
    items: [],
    status: StatusType.LOADING,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items.posts = [];
      state.posts.status = StatusType.LOADING;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items.posts = [];
      state.posts.status = StatusType.ERROR;
    });
    //Get tags
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.items = [
        { _id: '*****', count: 0 },
        { _id: '****', count: 0 },
        { _id: '*********', count: 0 },
        { _id: '*****', count: 0 },
        { _id: '******', count: 0 },
      ];
      state.tags.status = StatusType.LOADING;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = StatusType.SUCCESS;
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = StatusType.ERROR;
    });
    //Delete post
    builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
      state.posts.items.posts = state.posts.items.posts.filter(
        (obj) => obj._id !== action.payload
      );
    });
  },
});

export default postsSlice.reducer;
