import { UserType } from './user.model';

export type PostType = {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  emotion?: string;
  viewsCount: number;
  commentsCount: number;
  user: UserType;
  images: ImagesType[];
  taggedUsers: UserType[];
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  dislikesCount: number;
  liked: boolean;
  disliked: boolean;
};

export type ImagesType = {
  _id: string;
  url: string;
  previewUrl: string;
  isVideo: boolean;
  taggedUsers: [{ location: { x: string; y: string }; userId: string }];
  aspectRatio: number;
  caption: string;
};

export type MultimediaType = {
  _id: string;
  url: string;
  previewUrl: string;
  isVideo: boolean;
  taggedUsers: [{ location: { x: string; y: string }; userId: string }];
  aspectRatio: number;
  user: UserType;
  commentsCount: number;
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  liked: boolean;
  disliked: boolean;
  caption: string;
};
