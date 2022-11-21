import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { LikeSvg } from '../../icons';
import { LikesInfoType } from '../../models/CommentModel';
import { MultimediaType } from '../../models/PostModel';
import { putLikeMultimedia, putLikePost } from '../../services/PostServices';

import styles from './styles.module.scss';

interface IPostLikesInfo {
  id?: string;
  isMultimedia?: boolean;
  likesInfo: LikesInfoType;
  setMultimedia?: React.Dispatch<React.SetStateAction<MultimediaType[]>>;
}

const PostLikesInfo: React.FC<IPostLikesInfo> = ({
  likesInfo,
  isMultimedia,
  setMultimedia,
  id,
}) => {
  const [localLikesInfo, setLocalLikesInfo] = useState(likesInfo);

  useEffect(() => {
    setLocalLikesInfo(likesInfo);
  }, [likesInfo]);

  const handlePutLike = () => {
    if (id)
      if (isMultimedia) {
        putLikeMultimedia(id, true).then((res) => {
          if (res) setLocalLikesInfo(res);
          if (setMultimedia)
            setMultimedia((m) => m.map((item) => (item._id === id ? { ...item, ...res } : item)));
        });
      } else {
        putLikePost(id, true).then((res) => res && setLocalLikesInfo(res));
      }
  };

  const handlePutDislike = () => {
    if (id)
      if (isMultimedia) {
        putLikeMultimedia(id, false).then((res) => {
          if (res) setLocalLikesInfo(res);
          if (setMultimedia)
            setMultimedia((m) => m.map((item) => (item._id === id ? { ...item, ...res } : item)));
        });
      } else {
        putLikePost(id, false).then((res) => res && setLocalLikesInfo(res));
      }
  };

  return (
    <div className={styles.root}>
      <button
        className={classNames(styles.likes, localLikesInfo.liked && styles.active)}
        onClick={handlePutLike}
      >
        <LikeSvg />
        {localLikesInfo.likesCount}
      </button>
      <button
        className={classNames(
          styles.likes,
          styles.dislikes,
          localLikesInfo.disliked && styles.active
        )}
        onClick={handlePutDislike}
      >
        <LikeSvg />
        {localLikesInfo.dislikesCount}
      </button>
    </div>
  );
};

export default PostLikesInfo;
