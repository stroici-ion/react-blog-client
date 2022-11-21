import classNames from 'classnames';
import React from 'react';
import emoji from 'react-easy-emoji';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { EditSvg, PlaySvg, ReportSvg, ViewsSvg } from '../../icons';
import DateSvg from '../../icons/DateSvg';
import DeleteSvg from '../../icons/DeleteSvg';
import { PostType } from '../../models/PostModel';
import { selectUserData } from '../../redux/auth/selectors';
import { fetchRemovePost } from '../../redux/posts/asyncActions';
import { useAppDispatch } from '../../redux/store';
import { API_MULTIMEDIA_URL, FULL_POST_ROUTE, USER_PROFILE_ROUTE } from '../../utils/consts';
import { feelings } from '../../utils/emojisMap';
import { getTime } from '../../utils/getTime';
import getViews from '../../utils/getViews';
import CommentText from '../Comments/core/CommentText';
import ContextMenu from '../ContextMenu';
import { MODAL_TYPES, useGlobalModalContext } from '../Modals/GlobalModal';

import styles from './styles.module.scss';

interface IPreviewPost {
  className?: string;
  post: PostType;
}

const PreviewPost: React.FC<IPreviewPost> = ({ post, className }) => {
  const userData = useSelector(selectUserData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();

  const selectPost = () => {
    navigate(`/${FULL_POST_ROUTE}/${post._id}`);
  };

  const handleRemovePost = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure you want to delete this post?',
      callBack: () => dispatch(fetchRemovePost(post._id)),
    });
  };

  const handleEditPost = () => {
    showModal(MODAL_TYPES.ADD_POST_MODAL, {
      postId: post._id,
    });
  };

  const getImageOrVideo = () => {
    const firstVideo = post.images.find((image) => image.isVideo);
    if (firstVideo)
      return (
        <div
          className={styles.video}
          // style={{
          //   backgroundImage: `url('${
          //     API_MULTIMEDIA_URL + firstVideo.previewUrl
          //   }')`,
          // }}
        >
          <img src={API_MULTIMEDIA_URL + firstVideo.previewUrl} />
          <button className={classNames(styles.playVideoButton, styles.videoButton)}>
            <PlaySvg />
          </button>
          {post.images.length - 1 > 0 && (
            <div className={styles.moreImages}>+{post.images.length - 1}</div>
          )}
        </div>
      );
    else if (post.images[0])
      return (
        <div
          className={styles.image}
          // style={{
          //   backgroundImage: `url('${
          //     API_MULTIMEDIA_URL + post.images[0].url
          //   }')`,
          // }}
        >
          <img src={API_MULTIMEDIA_URL + post.images[0].url} />
          {post.images.length - 1 > 0 && (
            <div className={styles.moreImages}>+{post.images.length - 1}</div>
          )}
        </div>
      );
    if (!post.images.length)
      return (
        <div className={styles.post__text}>
          <p children={post.text} />
        </div>
      );
  };

  return (
    <div className={classNames(styles.root, className)} onClick={selectPost}>
      {getImageOrVideo()}
      <div className={classNames(styles.root__post, styles.post)}>
        <ContextMenu className={styles.post__submenu}>
          {userData?._id === post.user._id ? (
            <>
              <button className={styles.submenu__edit} onClick={handleEditPost}>
                <EditSvg />
                Edit post
              </button>
              <button className={styles.submenu__delete} onClick={handleRemovePost}>
                <DeleteSvg />
                Delete post
              </button>
            </>
          ) : (
            <button className={styles.submenu__delete} onClick={handleRemovePost}>
              <ReportSvg />
              Report post
            </button>
          )}
        </ContextMenu>
        <h4>{post.title}</h4>
        <p className={styles.post__fullName}>
          <Link to={USER_PROFILE_ROUTE + `/${post.user._id}`}>{post.user.fullName}</Link>
          {post.emotion && (
            <span>
              <span> is </span>
              {emoji(
                String.fromCodePoint(
                  parseInt(feelings.find((item) => item.name === post.emotion)?.code || '', 16)
                )
              )}{' '}
              feeling {post.emotion}
              {!post.taggedUsers.length && <span>.</span>}
            </span>
          )}
          {post.taggedUsers.length > 0 && (
            <>
              {!post.emotion && <span> is</span>}
              {post.taggedUsers.map((people, index) => (
                <React.Fragment key={people._id}>
                  <span>
                    {index === 0
                      ? ' with '
                      : index === post.taggedUsers.length - 1
                      ? ' and '
                      : ', '}
                  </span>
                  <Link to={USER_PROFILE_ROUTE + `/${people?._id}`}>{people.fullName}</Link>
                  {index === post.taggedUsers.length - 1 && <span>.</span>}
                </React.Fragment>
              ))}
            </>
          )}
        </p>

        <div className={styles.post__bottom_left}>
          <div className={styles.post__views}>
            <ViewsSvg />
            {getViews(post.viewsCount)}
          </div>
          <div className={styles.post__date}>
            <DateSvg />
            {getTime(post.createdAt.toString())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPost;
