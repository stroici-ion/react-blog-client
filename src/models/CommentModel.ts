import { UserType } from './user.model';

export type CommentType = {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isLikedByAuthor: boolean;
  isRepliedByAuthor: boolean;
  repliesCount: number;
  likesCount: number;
  dislikesCount: number;
  liked: boolean;
  disliked: boolean;
  user: UserType;
  isPinnedByAuthor?: boolean;
};

export type CreateCommentType = {
  text: string;
  postId?: string;
  multimediaId?: string;
};

export type CreateReplyType = {
  text: string;
  commentId: string;
  replyId?: string;
};

export type ReplyType = {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isLikedByAuthor: boolean;
  likesCount: number;
  dislikesCount: number;
  liked: boolean;
  disliked: boolean;
  user: UserType;
  refUser?: UserType;
};

export type LikesInfoType = {
  liked: boolean;
  disliked: boolean;
  likesCount: number;
  dislikesCount: number;
};
