import React, { useEffect, useRef, useState } from 'react';
import { SortCommentsByEnum } from '../..';
import { ReturnBackSvg } from '../../../../icons';

import { CommentType } from '../../../../models/CommentModel';
import { UserType } from '../../../../models/user.model';
import { getComments } from '../../../../services/CommentsServices';
import Loader from '../../../Loaders/Loader';
import Comment from '../Comment';
import styles from './styles.module.scss';

interface IRecentComments {
  sortBy: SortCommentsByEnum;
  isMultimedia: boolean;
  postId: string;
  owner: UserType;
  setPinnedComment: React.Dispatch<React.SetStateAction<CommentType | undefined>>;
}

const RecentComments: React.FC<IRecentComments> = ({
  sortBy,
  postId,
  owner,
  isMultimedia,
  setPinnedComment,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feetchedComments, setFeetchedComments] = useState<CommentType[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const isFeetched = useRef(false);

  useEffect(() => {
    setFeetchedComments([]);
    if (page === 1) fetchComments();
    setPage(1);
  }, [sortBy, postId]);

  useEffect(() => {
    if (isFeetched.current) fetchComments();
  }, [page]);

  const fetchComments = async () => {
    setIsLoading(true);
    const res = await getComments(postId, page, limit, isMultimedia, sortBy);
    if (res) {
      if (!count) setCount(res.count);
      if (page === 1) {
        setFeetchedComments(res.comments);
      } else {
        setFeetchedComments([...feetchedComments, ...res.comments]);
      }
      const pinnedComment = res.comments.find((comment) => comment.isPinnedByAuthor);
      if (pinnedComment) {
        setPinnedComment(pinnedComment);
      }
    }
    setIsLoading(false);
    isFeetched.current = true;
  };

  if (isLoading)
    return (
      <div className={styles.root}>
        <Loader></Loader>
      </div>
    );

  return (
    <div className={styles.root}>
      {feetchedComments.length === 0 && (
        <p className={styles.root__empty} children={'No comments'} />
      )}
      {feetchedComments
        .filter((comment) => !!comment.isPinnedByAuthor === false)
        .map((comment) => (
          <Comment
            isMultimedia={isMultimedia}
            setComments={setFeetchedComments}
            setPinnedComment={setPinnedComment}
            owner={owner}
            key={comment._id}
            postId={postId}
            comment={comment}
          />
        ))}
      {sortBy !== SortCommentsByEnum.MOST_RELEVANT && count > feetchedComments.length && (
        <button className={styles.root__moreComments} onClick={() => setPage(page + 1)}>
          <span>•••</span>
          <ReturnBackSvg />
          View more comments
        </button>
      )}
    </div>
  );
};

export default RecentComments;
