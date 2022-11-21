import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectUserData } from '../../../../redux/auth/selectors';
import { createComment } from '../../../../services/CommentsServices';
import { CommentType } from '../../../../models/CommentModel';
import WriteComment from '../WriteComment';
import Comment from '../Comment';
import Loader from '../../../Loaders/Loader';
import styles from './styles.module.scss';
import { UserType } from '../../../../models/user.model';

interface IRecentComments {
  isMultimedia: boolean;
  sortBy: string;
  owner: UserType;
  postId: string;
  pinnedComment?: CommentType | undefined;
  setPinnedComment: React.Dispatch<React.SetStateAction<CommentType | undefined>>;
}

const RecentComments: React.FC<IRecentComments> = ({
  sortBy,
  pinnedComment,
  setPinnedComment,
  postId,
  owner,
  isMultimedia,
}) => {
  const user = useSelector(selectUserData);
  const [recentComments, setRecentComments] = useState<CommentType[]>([]);
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);
  const [recentPinnedComments, setRecentPinnedComments] = useState<CommentType[]>([]);

  useEffect(() => {
    setRecentComments([]);
    setRecentPinnedComments(pinnedComment ? [pinnedComment] : []);
  }, [sortBy, postId]);

  useEffect(() => {
    if (pinnedComment) {
      const pinnedCandidate = recentPinnedComments.find(
        (comment) => comment._id === pinnedComment._id
      );
      if (!pinnedCandidate) {
        setRecentPinnedComments([
          pinnedComment,
          ...recentPinnedComments.map((comment) => {
            return { ...comment, isPinnedByAuthor: false };
          }),
        ]);
      } else {
        setRecentPinnedComments([
          pinnedCandidate,
          ...recentPinnedComments.filter((comment) => comment._id !== pinnedCandidate._id),
        ]);
      }
    }
  }, [pinnedComment]);

  const handleCreateComment = async (text: string) => {
    if (user) {
      setIsCreateCommentLoading(true);
      const res = await createComment({
        text,
        postId: !isMultimedia ? postId : undefined,
        multimediaId: isMultimedia ? postId : undefined,
      });
      if (res) {
        const newComment: CommentType = {
          ...res,
          isLikedByAuthor: false,
          likesCount: 0,
          dislikesCount: 0,
          liked: false,
          disliked: false,
          user: { ...user },
          repliesCount: 0,
          isRepliedByAuthor: false,
        };
        setRecentComments([newComment, ...recentComments]);
      }
      setIsCreateCommentLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {isCreateCommentLoading ? (
        <Loader height={91} size={30} />
      ) : (
        <WriteComment sendComment={handleCreateComment} />
      )}
      {recentPinnedComments.map((comment) => (
        <Comment
          isPinned={true}
          wasPinned={comment._id !== pinnedComment?._id}
          setPinnedComment={setPinnedComment}
          isMultimedia={isMultimedia}
          setComments={setRecentPinnedComments}
          owner={owner}
          key={comment._id}
          postId={postId}
          comment={comment}
        />
      ))}
      {recentComments
        .filter((comment) => !comment.isPinnedByAuthor)
        .map((comment) => (
          <Comment
            setPinnedComment={setPinnedComment}
            isMultimedia={isMultimedia}
            setComments={setRecentComments}
            owner={owner}
            key={comment._id}
            postId={postId}
            comment={comment}
          />
        ))}
    </div>
  );
};

export default RecentComments;
