import { createAsyncThunk } from '@reduxjs/toolkit';
import { getThumbnails } from 'video-metadata-thumbnails';

import { SortByEnum } from '../search/types';
import { PostType } from '../../models/PostModel';
import { TagsType } from './types';
import { isVideo } from '../../utils/files';
import axios from '../../axios';
import $api from '../../http';

type FetchPostsParamsType = {
  tags?: string[];
  userId?: string;
  sortBy?: SortByEnum;
};

type FetchPostsType = { count: number; posts: PostType[] };

export const fetchPosts = createAsyncThunk<FetchPostsType, FetchPostsParamsType>(
  'posts/fetchPosts',
  async (params) => {
    const { data } = await $api.get<FetchPostsType>('/posts', { params });
    return data;
  }
);

export const fetchTags = createAsyncThunk<TagsType[]>('posts/fetchTags', async () => {
  const { data } = await $api.get<TagsType[]>('/tags');
  return data;
});

export const fetchRemovePost = createAsyncThunk<any, string>(
  'posts/fetchRemovePost',
  async (id) => {
    $api.delete(`/posts/${id}`);
    return id;
  }
);
