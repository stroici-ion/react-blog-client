import { PostType } from '../../models/PostModel';

export interface IFullPostState {
  post?: PostType;
  selectedImageId: string;
  isVisible: boolean;
}
