import React, { useState } from 'react';
import classNames from 'classnames';

import { LikesInfoType } from '../../../../models/CommentModel';
import SmallButton from '../../../UI/Buttons/SmallButton';
import { HeartSvg, LikeSvg } from '../../../../icons';
import styles from './styles.module.scss';
import {
  putCommentLike,
  putCommentLikeByAuthor,
  putReplyLike,
  putReplyLikeByAuthor,
} from '../../../../services/CommentsServices';
import { UserType } from '../../../../models/user.model';
import { API_IMAGES_URL } from '../../../../utils/consts';

interface ICommentActions {
  isMultimedia: boolean;
  isOwner: boolean;
  owner: UserType;
  id: string;
  isReply?: boolean;
  handleToggleCreateRelpy: () => void;
  setLikesInfo?: (
    fe: LikesInfoType & {
      isLikedByAuthor: boolean;
    }
  ) => void;
  className?: string;
  likesInfo: LikesInfoType & {
    isLikedByAuthor: boolean;
  };
}

const CommentActions: React.FC<ICommentActions> = ({
  isOwner,
  owner,
  handleToggleCreateRelpy,
  setLikesInfo,
  isReply = false,
  id,
  className,
  likesInfo,
  isMultimedia,
}) => {
  const [localLikesInfo, setLocalLikesInfo] = useState(likesInfo);

  const handlePutLike = async () => {
    if (isReply) {
      const feetchedLikesInfo = await putReplyLike(id, true);
      if (feetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
      }
      return;
    }
    const feetchedLikesInfo = await putCommentLike(id, true);
    if (feetchedLikesInfo) {
      setLocalLikesInfo({ ...localLikesInfo, ...feetchedLikesInfo });
    }
  };

  const handlePutDislike = async () => {
    if (isReply) {
      const feetchedLikesInfo = await putReplyLike(id, false);
      if (feetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
      }
      return;
    }
    const feetchedLikesInfo = await putCommentLike(id, false);
    if (feetchedLikesInfo) {
      setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
    }
  };

  const handlePuteLikeByAuthor = async () => {
    if (isReply) {
      const feetchedLikeByAuthor = await putReplyLikeByAuthor(id, isMultimedia);
      if (feetchedLikeByAuthor !== undefined && setLikesInfo) {
        setLikesInfo({
          ...likesInfo,
          isLikedByAuthor: feetchedLikeByAuthor,
        });
        setLocalLikesInfo({
          ...likesInfo,
          isLikedByAuthor: feetchedLikeByAuthor,
        });
      }
      return;
    }
    const feetchedLikeByAuthor = await putCommentLikeByAuthor(id, isMultimedia);

    if (feetchedLikeByAuthor !== undefined) {
      setLocalLikesInfo({
        ...localLikesInfo,
        isLikedByAuthor: feetchedLikeByAuthor,
      });
    }
  };

  return (
    <div className={classNames(className, styles.actions)}>
      <div className={classNames(styles.actions__like, localLikesInfo.liked && styles.active)}>
        <SmallButton onClick={handlePutLike}>
          <LikeSvg />
        </SmallButton>
        <span>{localLikesInfo.likesCount}</span>
      </div>
      <div
        className={classNames(styles.actions__dislike, localLikesInfo.disliked && styles.active)}
      >
        <SmallButton onClick={handlePutDislike}>
          <LikeSvg />
        </SmallButton>
        <span>{localLikesInfo.dislikesCount}</span>
      </div>
      {(isOwner || localLikesInfo.isLikedByAuthor) && (
        <div
          className={classNames(
            styles.actions__likeByAuthor,
            isOwner && styles.editable,
            localLikesInfo.isLikedByAuthor && styles.active
          )}
        >
          <SmallButton onClick={handlePuteLikeByAuthor}>
            <HeartSvg />
            <img src={API_IMAGES_URL + owner.avatarUrl} />
          </SmallButton>
        </div>
      )}

      <button onClick={handleToggleCreateRelpy} className={styles.actions__reply}>
        Reply
      </button>
    </div>
  );
};

export default CommentActions;
