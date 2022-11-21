import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { selectUserData } from '../../../../redux/auth/selectors';
import { API_IMAGES_URL, USER_PROFILE_ROUTE } from '../../../../utils/consts';
import { CommentType } from '../../../../models/CommentModel';
import CommentActions from '../CommentActions';
import CommentText from '../CommentText';
import { getTime } from '../../../../utils/getTime';
import Replies from '../Replies';
import styles from './styles.module.scss';
import { UserType } from '../../../../models/user.model';
import { EditSvg, PinSvg, ReportSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import WriteComment from '../WriteComment';
import {
  editComment,
  removeComment,
  togglePinnedComment,
} from '../../../../services/CommentsServices';
import { MODAL_TYPES, useGlobalModalContext } from '../../../Modals/GlobalModal';
import CommentContextMenu from '../CommentContextMenu';
import { Link } from 'react-router-dom';

interface IComment {
  isPinned?: boolean;
  wasPinned?: boolean;
  setPinnedComment: React.Dispatch<React.SetStateAction<CommentType | undefined>>;
  comment: CommentType;
  owner: UserType;
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  isMultimedia: boolean;
}

const Comment: React.FC<IComment> = ({
  isPinned = false,
  wasPinned = false,
  comment,
  postId,
  owner,
  setPinnedComment,
  setComments,
  isMultimedia,
}) => {
  const user = useSelector(selectUserData);
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCommentLoading, setIsEditingCommentLoading] = useState(false);
  const { showModal } = useGlobalModalContext();

  const handleToggleCreateRelpy = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: comment.liked,
    disliked: comment.disliked,
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
    isLikedByAuthor: comment.isLikedByAuthor,
  };

  const handleRemoveComment = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure tou want to update comment?',
      callBack: async () => {
        setIsEditingCommentLoading(true);
        const newComment = await removeComment(comment._id, isMultimedia);
        if (newComment) {
          setComments((comments) => comments.filter((item) => item._id !== comment._id));
        }
        setIsEditingCommentLoading(false);
        setIsEditing(false);
      },
    });
  };

  const handleToogleEditComment = () => {
    setIsEditing(!isEditing);
  };

  const handleTogglePinnedComment = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure tou want to update pinned comment?',
      callBack: async () => {
        const result = await togglePinnedComment(postId, comment._id, isMultimedia);

        if (result) {
          if (result.isPinned) {
            setComments((comments) =>
              comments.map((item) =>
                item._id === comment._id ? { ...item, isPinnedByAuthor: true } : item
              )
            );
            setPinnedComment({ ...comment, isPinnedByAuthor: true });
          } else {
            setComments((comments) =>
              comments.map((item) =>
                item._id === comment._id ? { ...item, isPinnedByAuthor: false } : item
              )
            );
            setPinnedComment(undefined);
          }
        }
      },
    });
  };

  const handleEditComment = async (value: string) => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure tou want to update comment?',
      callBack: async () => {
        setIsEditingCommentLoading(true);
        const newComment = await editComment(comment._id, value);
        if (newComment) {
          setComments((comments) =>
            comments.map((item) => (item._id === comment._id ? { ...item, text: value } : item))
          );
        }
        setIsEditingCommentLoading(false);
        setIsEditing(false);
      },
    });
  };

  const commentContextMenuButtons = {
    editButton: (
      <button className={styles.submenu__edit} onClick={handleToogleEditComment}>
        <EditSvg />
        Edit comment
      </button>
    ),
    deleteButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveComment}>
        <DeleteSvg />
        Delete comment
      </button>
    ),
    reportButton: (
      <button className={styles.submenu__report} onClick={handleRemoveComment}>
        <ReportSvg />
        Report comment
      </button>
    ),
    pinButton: (
      <button className={styles.submenu__pin} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Pin comment
      </button>
    ),
    unpinButton: (
      <button className={styles.submenu__unpin} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Unpin comment
      </button>
    ),
  };

  return (
    <>
      {isEditing ? (
        <WriteComment
          initialValue={comment.text}
          hide={handleToogleEditComment}
          sendComment={handleEditComment}
        />
      ) : (
        <div className={classNames(styles.comment, isPinned && styles.pinned)}>
          {isPinned && (
            <div
              className={classNames(styles.comment__pinned, wasPinned && styles.comment__wasPinned)}
            >
              <PinSvg />
              {wasPinned ? 'Was' : 'Is'} pinned by{' '}
              <Link
                to={USER_PROFILE_ROUTE + '/' + owner._id}
                className={styles.comment__pinned_owner}
              >
                {owner.fullName}
              </Link>
            </div>
          )}
          <img className={styles.comment__avatar} src={API_IMAGES_URL + comment.user.avatarUrl} />
          <div className={styles.comment__body}>
            <div className={styles.comment__top}>
              <div className={styles.comment__info}>
                <p
                  className={classNames(
                    styles.comment__nameInfo,
                    comment.user._id === owner._id && styles.comment__nameInfo_owner
                  )}
                >
                  {comment.user.fullName}
                </p>
                <span className={styles.comment__timeInfo}>{getTime(comment.createdAt)}</span>
              </div>
              <CommentContextMenu
                isPinnedByAuthor={comment.isPinnedByAuthor}
                ownerId={owner._id}
                commentOwnerId={comment.user._id}
                className={styles.submenu}
                buttons={commentContextMenuButtons}
              />
            </div>
            <CommentText text={comment.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={user?._id === owner._id}
              id={comment._id}
              className={styles.root__actions}
              handleToggleCreateRelpy={handleToggleCreateRelpy}
              likesInfo={likesInfo}
            />
            <Replies
              isMultimedia={isMultimedia}
              owner={owner}
              isRepliedByAuthor={comment.isRepliedByAuthor}
              isCreateReplyVisible={isCreateReplyVisible}
              setIsCreateReplyVisible={setIsCreateReplyVisible}
              commentId={comment._id}
              repliesCount={comment.repliesCount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
