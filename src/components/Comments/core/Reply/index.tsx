import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { createReply, editReply, removeReply } from '../../../../services/CommentsServices';
import { selectUserData } from '../../../../redux/auth/selectors';
import { LikesInfoType, ReplyType } from '../../../../models/CommentModel';
import { API_IMAGES_URL } from '../../../../utils/consts';
import { getTime } from '../../../../utils/getTime';
import CommentActions from '../CommentActions';
import CommentText from '../CommentText';
import WriteComment from '../WriteComment';
import styles from './styles.module.scss';
import Loader from '../../../Loaders/Loader';
import { UserType } from '../../../../models/user.model';
import ContextMenu from '../../../ContextMenu';
import { EditSvg, ReportSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import { MODAL_TYPES, useGlobalModalContext } from '../../../Modals/GlobalModal';
import CommentContextMenu from '../CommentContextMenu';

interface IReply {
  isMultimedia: boolean;
  owner: UserType;
  reply: ReplyType;
  commentId: string;
  setRecentReplies: React.Dispatch<React.SetStateAction<ReplyType[]>>;
  setFeetchedReplies?: React.Dispatch<React.SetStateAction<ReplyType[]>>;
}

const Reply: React.FC<IReply> = ({
  isMultimedia,
  owner,
  reply,
  commentId,
  setRecentReplies,
  setFeetchedReplies,
}) => {
  const user = useSelector(selectUserData);
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [isEditingReplyLoading, setIsEditingReplyLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showModal } = useGlobalModalContext();

  const handleCreateReply = async (text: string) => {
    if (user) {
      setIsCreateReplyLoading(true);
      const res = await createReply({
        text,
        commentId,
        replyId: reply.user._id !== user?._id ? reply._id : undefined,
      });
      if (res) {
        const newReply: ReplyType = {
          ...res,
          isLikedByAuthor: false,
          likesCount: 0,
          dislikesCount: 0,
          liked: false,
          disliked: false,
          user: { ...user },
          refUser: reply.user._id !== user?._id ? reply.user : undefined,
        };
        setRecentReplies((recentReplies) => [...recentReplies, newReply]);
      }
      setIsCreateReplyLoading(false);
      setIsCreateReplyVisible(false);
    }
  };

  const handleToggleCreateRelpy = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: reply.liked,
    disliked: reply.disliked,
    likesCount: reply.likesCount,
    dislikesCount: reply.dislikesCount,
    isLikedByAuthor: reply.isLikedByAuthor,
  };

  const setLikesInfo = (
    fetchedLikesInfo: LikesInfoType & {
      isLikedByAuthor: boolean;
    }
  ) => {
    if (setFeetchedReplies) {
      setFeetchedReplies((feetchedReplies) =>
        feetchedReplies.map((item) =>
          item._id === reply._id ? { ...reply, ...fetchedLikesInfo } : item
        )
      );
      return;
    }
    setRecentReplies((recentReplies) =>
      recentReplies.map((item) =>
        item._id === reply._id ? { ...reply, ...fetchedLikesInfo } : item
      )
    );
  };

  const handleRemoveReply = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure tou want to update comment?',
      callBack: async () => {
        setIsEditingReplyLoading(true);
        const result = await removeReply(reply._id);
        if (result) {
          if (setFeetchedReplies) {
            setFeetchedReplies((replies) => replies.filter((item) => item._id !== reply._id));
          } else {
            setRecentReplies((replies) => replies.filter((item) => item._id !== reply._id));
          }
        }
        setIsEditingReplyLoading(false);
        setIsEditing(false);
      },
    });
  };

  const handleToogleEditReply = () => {
    setIsEditing(!isEditing);
  };

  const handleEditReply = async (value: string) => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure tou want to update comment?',
      callBack: async () => {
        setIsEditingReplyLoading(true);
        const updatedReply = await editReply(reply._id, value);
        if (updatedReply) {
          if (setFeetchedReplies) {
            setFeetchedReplies((replies) =>
              replies.map((item) => (item._id === reply._id ? { ...item, text: value } : item))
            );
          } else {
            setRecentReplies((replies) =>
              replies.map((item) => (item._id === reply._id ? { ...item, text: value } : item))
            );
          }
        }
        setIsEditingReplyLoading(false);
        setIsEditing(false);
      },
    });
  };

  const replyContextMenuButtons = {
    editButton: (
      <button className={styles.submenu__edit} onClick={handleToogleEditReply}>
        <EditSvg />
        Edit reply
      </button>
    ),
    deleteButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveReply}>
        <DeleteSvg />
        Delete reply
      </button>
    ),
    reportButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveReply}>
        <ReportSvg />
        Report reply
      </button>
    ),
  };

  return (
    <>
      {isEditing ? (
        <WriteComment isReply={true} hide={handleToogleEditReply} sendComment={handleEditReply} />
      ) : (
        <div className={styles.comment}>
          <img className={styles.comment__avatar} src={API_IMAGES_URL + reply.user.avatarUrl} />
          <div className={styles.comment__body}>
            <div className={styles.comment__top}>
              <div className={styles.comment__info}>
                <p
                  className={classNames(
                    styles.comment__nameInfo,
                    reply.user._id === owner._id && styles.comment__nameInfo_owner
                  )}
                >
                  {reply.user.fullName}
                </p>
                <span className={styles.comment__timeInfo}>{getTime(reply.createdAt)}</span>
              </div>
              <CommentContextMenu
                ownerId={owner._id}
                commentOwnerId={reply.user._id}
                className={styles.submenu}
                buttons={replyContextMenuButtons}
              />
            </div>
            <CommentText
              className={styles.comment__text}
              refUser={reply.refUser}
              text={reply.text}
            />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={user?._id === owner._id}
              isReply={true}
              id={reply._id}
              className={styles.root__actions}
              handleToggleCreateRelpy={handleToggleCreateRelpy}
              setLikesInfo={setLikesInfo}
              likesInfo={likesInfo}
            />
            {isCreateReplyVisible &&
              (isCreateReplyLoading ? (
                <Loader height={81} size={30} />
              ) : (
                <WriteComment
                  isReply={true}
                  hide={handleToggleCreateRelpy}
                  sendComment={handleCreateReply}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Reply);
