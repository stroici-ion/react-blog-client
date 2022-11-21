import React, { useEffect, useState } from 'react';
import capitalize from 'lodash.capitalize';

import FeetchedComments from './core/FeetchedComments';
import RecentComments from './core/RecentComments';
import { CommentType } from '../../models/CommentModel';
import styles from './styles.module.scss';
import { UserType } from '../../models/user.model';
import { SortSvg } from '../../icons';
import ContextMenu from '../ContextMenu';

interface IComments {
  id: string;
  isMultimedia?: boolean;
  owner: UserType;
}

export enum SortCommentsByEnum {
  MOST_RELEVANT = 'most_relevant',
  NEWEST = 'newest',
  ALL_COMMENTS = 'all_comments',
}

const Comments: React.FC<IComments> = ({ id, owner, isMultimedia = false }) => {
  const [sortBy, setSortBy] = useState(SortCommentsByEnum.MOST_RELEVANT);
  const [pinnedComment, setPinnedComment] = useState<CommentType>();

  return (
    <div className={styles.root}>
      <div className={styles.root__top}>
        <ContextMenu
          className={styles.sortTypes}
          openButton={(onClick: any) => (
            <button className={styles.root__sortBy} onClick={onClick}>
              {capitalize(sortBy.replace('_', ' '))}
              <SortSvg />
            </button>
          )}
        >
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.MOST_RELEVANT)}
          >
            {capitalize(SortCommentsByEnum.MOST_RELEVANT.replace('_', ' '))}
          </button>
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.NEWEST)}
          >
            {capitalize(SortCommentsByEnum.NEWEST.replace('_', ' '))}
          </button>
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.ALL_COMMENTS)}
          >
            {capitalize(SortCommentsByEnum.ALL_COMMENTS.replace('_', ' '))}
          </button>
        </ContextMenu>
      </div>
      <RecentComments
        sortBy={sortBy}
        isMultimedia={isMultimedia}
        owner={owner}
        postId={id}
        pinnedComment={pinnedComment}
        setPinnedComment={setPinnedComment}
      />
      <FeetchedComments
        sortBy={sortBy}
        setPinnedComment={setPinnedComment}
        isMultimedia={isMultimedia}
        owner={owner}
        postId={id}
      />
    </div>
  );
};

export default Comments;
