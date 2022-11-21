import $api from '../http';
import { LikesInfoType } from '../models/CommentModel';
import { MultimediaType, PostType } from '../models/PostModel';

export const getPostById = async (id: string) => {
  const { data } = await $api.get<PostType>(`/posts/${id}`);
  return data;
};

export const getMultimediaById = async (id: string) => {
  const { data } = await $api.get<MultimediaType>(`/posts/multimedia/${id}`);
  return data;
};

export const putLikePost = async (postId: string, like: boolean) => {
  try {
    const { data } = await $api.post<LikesInfoType>('/posts/like/' + postId, {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putLikeMultimedia = async (postId: string, like: boolean) => {
  try {
    const { data } = await $api.post<LikesInfoType>('/posts/multimedia/like/' + postId, {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};
