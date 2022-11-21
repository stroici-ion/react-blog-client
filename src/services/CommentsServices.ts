import $api from '../http';
import {
  CommentType,
  CreateCommentType,
  CreateReplyType,
  LikesInfoType,
  ReplyType,
} from '../models/CommentModel';

export const createComment = async (params: CreateCommentType) => {
  try {
    const { data } = await $api.post<{
      _id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
    }>('/comments', params);
    if (data) {
      return data;
    } else {
      console.error('Error sending comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const editComment = async (id: string, text: string) => {
  try {
    const { data } = await $api.put<{
      text: string;
      updatedAt: string;
    }>('/comments/' + id, { text });
    if (data) {
      return data;
    } else {
      console.error('Error while editing comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const removeComment = async (id: string, isMultimedia: boolean) => {
  try {
    const { data } = await $api.delete<{
      text: string;
      updatedAt: string;
    }>('/comments/' + id, { params: { isMultimedia } });
    if (data) {
      return data;
    } else {
      console.error('Error while deleting comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const getComments = async (
  postId: string,
  page: number,
  limit: number,
  isMultimedia: boolean,
  sortBy: string
) => {
  try {
    const { data } = await $api.get<{
      comments: CommentType[];
      count: number;
    }>('/comments/' + postId, {
      params: { page, limit, isMultimedia, sortBy },
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const createReply = async (params: CreateReplyType) => {
  try {
    const { data } = await $api.post<{
      _id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
    }>('/comments/replies', params);
    if (data) {
      return data;
    } else {
      console.error('Error sending answer');
    }
  } catch (e) {
    console.error(e);
  }
};

export const editReply = async (id: string, text: string) => {
  try {
    const { data } = await $api.put<{
      text: string;
      updatedAt: string;
    }>('/comments/replies/' + id, { text });
    if (data) {
      return data;
    } else {
      console.error('Error while editing reply');
    }
  } catch (e) {
    console.error(e);
  }
};

export const removeReply = async (id: string) => {
  try {
    const { data } = await $api.delete<{
      text: string;
      updatedAt: string;
    }>('/comments/replies/' + id);
    if (data) {
      return data;
    } else {
      console.error('Error while deleting reply');
    }
  } catch (e) {
    console.error(e);
  }
};

export const getReplies = async (commentId: string, page: number, limit: number) => {
  try {
    const { data } = await $api.get<ReplyType[]>('/comments/replies/' + commentId, {
      params: { page, limit },
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putCommentLike = async (commentId: string, like: boolean) => {
  try {
    const { data } = await $api.post<LikesInfoType>('/comments/like/' + commentId, {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putReplyLike = async (replyId: string, like: boolean) => {
  try {
    const { data } = await $api.post<LikesInfoType>('/comments/replies/like/' + replyId, {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putCommentLikeByAuthor = async (commentId: string, isMultimedia: boolean) => {
  try {
    const { data } = await $api.post<boolean>('/comments/like/by-author/' + commentId, {
      isMultimedia,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putReplyLikeByAuthor = async (replyId: string, isMultimedia: boolean) => {
  try {
    const { data } = await $api.post<boolean>('/comments/replies/like/by-author/' + replyId, {
      isMultimedia,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const togglePinnedComment = async (
  postId: string,
  commentId: string,
  isMultimedia: boolean
) => {
  try {
    const { data } = await $api.post('/posts/pin-comment/' + postId, {
      commentId,
      isMultimedia,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};
