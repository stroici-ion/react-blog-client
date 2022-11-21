import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { createReply, getReplies } from '../../../../services/CommentsServices';
import { selectUserData } from '../../../../redux/auth/selectors';
import { ArrowDownSvg, ReturnBackSvg } from '../../../../icons';
import { ReplyType } from '../../../../models/CommentModel';
import WriteComment from '../WriteComment';
import Loader from '../../../Loaders/Loader';
import styles from './styles.module.scss';
import Reply from '../Reply';
import { UserType } from '../../../../models/user.model';
import { API_IMAGES_URL } from '../../../../utils/consts';

interface IReplies {
  isMultimedia: boolean;
  owner: UserType;
  isRepliedByAuthor: boolean;
  repliesCount: number;
  commentId: string;
  isCreateReplyVisible: boolean;
  setIsCreateReplyVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Replies: React.FC<IReplies> = ({
  isMultimedia,
  owner,
  commentId,
  isCreateReplyVisible,
  isRepliedByAuthor,
  setIsCreateReplyVisible,
  repliesCount,
}) => {
  const user = useSelector(selectUserData);

  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [isFetchedRepliesVisible, setIsFetchedRepliesVisible] = useState(false);
  const [recentReplies, setRecentReplies] = useState<ReplyType[]>([]);
  const [feetchedReplies, setFeetchedReplies] = useState<ReplyType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const totalPages = Math.ceil(repliesCount / limit);

  const handleCreateReply = async (text: string) => {
    if (user) {
      setIsCreateReplyLoading(true);
      const res = await createReply({ text, commentId });
      if (res) {
        const newReply: ReplyType = {
          ...res,
          isLikedByAuthor: false,
          likesCount: 0,
          dislikesCount: 0,
          liked: false,
          disliked: false,
          user: { ...user },
        };
        setRecentReplies([...recentReplies, newReply]);
      }
      setIsCreateReplyLoading(false);
      setIsCreateReplyVisible(false);
    }
  };

  useEffect(() => {
    if (isFetchedRepliesVisible && !feetchedReplies.length) {
      setIsRepliesLoading(true);
      getReplies(commentId, page, limit).then((replies) => {
        if (replies) setFeetchedReplies([...feetchedReplies, ...replies]);
        setIsRepliesLoading(false);
      });
    }
  }, [isFetchedRepliesVisible]);

  useEffect(() => {
    if (feetchedReplies.length) {
      setIsRepliesLoading(true);
      getReplies(commentId, page, limit).then((replies) => {
        if (replies) setFeetchedReplies([...feetchedReplies, ...replies]);
        setIsRepliesLoading(false);
      });
    }
  }, [page]);

  return (
    <div className={styles.root}>
      {isCreateReplyLoading ? (
        <Loader height={91} size={30} />
      ) : (
        isCreateReplyVisible && (
          <WriteComment
            isReply={true}
            hide={() => setIsCreateReplyVisible(false)}
            sendComment={handleCreateReply}
          />
        )
      )}
      {repliesCount > 0 && (
        <button
          className={styles.root__button}
          onClick={() => setIsFetchedRepliesVisible(!isFetchedRepliesVisible)}
        >
          <ArrowDownSvg />
          {isRepliedByAuthor && (
            <>
              <img className={styles.root__avatar} src={API_IMAGES_URL + owner.avatarUrl} />
              <span className={styles.root__avatarDecoration}>•</span>
            </>
          )}
          View {repliesCount} {`repl${repliesCount > 1 ? 'ies' : 'y'}`}
        </button>
      )}
      {isFetchedRepliesVisible && (
        <>
          {feetchedReplies
            .filter((reply) => !recentReplies.map((recent) => recent._id).includes(reply._id))
            .map((reply) => (
              <Reply
                isMultimedia={isMultimedia}
                setFeetchedReplies={setFeetchedReplies}
                setRecentReplies={setRecentReplies}
                key={reply._id}
                commentId={commentId}
                reply={reply}
                owner={owner}
              />
            ))}
          {recentReplies.map((reply) => (
            <Reply
              isMultimedia={isMultimedia}
              setRecentReplies={setRecentReplies}
              key={reply._id}
              commentId={commentId}
              owner={owner}
              reply={reply}
            />
          ))}
          {isRepliesLoading ? (
            <Loader height={91} size={30} />
          ) : (
            totalPages > page && (
              <button className={styles.root__showMoreButton} onClick={() => setPage(page + 1)}>
                <ReturnBackSvg />
                Show more replies
              </button>
            )
          )}
        </>
      )}
      {!isFetchedRepliesVisible &&
        recentReplies.map((reply) => (
          <Reply
            isMultimedia={isMultimedia}
            owner={owner}
            setRecentReplies={setRecentReplies}
            key={reply._id}
            commentId={commentId}
            reply={reply}
          />
        ))}
    </div>
  );
};

export default Replies;
