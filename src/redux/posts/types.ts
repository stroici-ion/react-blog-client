import { PostType } from '../../models/PostModel';

export interface IPostsState {
  posts: {
    items: { count: number; posts: PostType[] };
    status: StatusType;
  };
  tags: {
    items: TagsType[];
    status: StatusType;
  };
}

export enum StatusType {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type TagsType = {
  _id: string;
  count: number;
};
