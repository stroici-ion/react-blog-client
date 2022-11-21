import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import emoji from 'react-easy-emoji';

import { MODAL_TYPES, useGlobalModalContext } from '../Modals/GlobalModal';
import { API_IMAGES_URL, FULL_POST_ROUTE, USER_PROFILE_ROUTE } from '../../utils/consts';
import { setTag } from '../../redux/search/slice';
import { fetchRemovePost } from '../../redux/posts/asyncActions';
import { selectUserData } from '../../redux/auth/selectors';
import { useAppDispatch } from '../../redux/store';
import { getLikes } from '../../utils/getLikesCount';
import { PostType } from '../../models/PostModel';
import { feelings } from '../../utils/emojisMap';
import { getTime } from '../../utils/getTime';
import CommentText from '../Comments/core/CommentText';
import ContextMenu from '../ContextMenu';
import DeleteSvg from '../../icons/DeleteSvg';
import getViews from '../../utils/getViews';
import Comments from '../Comments';
import Images from '../Images';
import styles from './styles.module.scss';
import { EditSvg, LikeSvg, MessagingSvg, ReportSvg, ViewsSvg } from '../../icons';
import { setPost } from '../../redux/fullPost/slice';
import PostLikesInfo from '../PostLikesInfo';

interface IPost {
  small?: boolean;
  post: PostType;
}

const Post: React.FC<IPost> = ({ post, small = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const userData = useSelector(selectUserData);

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

  const onClickFetchPosts = (tag: string) => {
    dispatch(setTag(tag));
    navigate('/');
  };

  const handleViewComments = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };

  const handleSetPost = (imageId: string) => {
    dispatch(setPost({ post, imageId }));
  };

  return (
    <div className={styles.post}>
      <div className={styles.post__content}>
        <div className={styles.post__top}>
          <div className={styles.post__top_right}>
            <img
              onClick={() => {
                navigate(USER_PROFILE_ROUTE + '/' + post.user._id);
              }}
              src={API_IMAGES_URL + post.user.avatarUrl}
              className={styles.post__avatar}
            />
            <div className={styles.post__info}>
              <p className={styles.post__fullName}>
                <Link to={USER_PROFILE_ROUTE + `/${post.user._id}`}>{post.user.fullName}</Link>
                {post.emotion && (
                  <span>
                    <span> is </span>
                    {emoji(
                      String.fromCodePoint(
                        parseInt(
                          feelings.find((item) => item.name === post.emotion)?.code || '',
                          16
                        )
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
              <p className={styles.post__date}>{getTime(post.createdAt.toString())}</p>
            </div>
          </div>
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
        </div>
        <div className={styles.post__text}>
          <h4 className={styles.post__title}>{post.title}</h4>
          <CommentText text={post.text} />
        </div>
        <div>
          <Images small={small} setPost={handleSetPost} images={post.images} />
        </div>
        <div className={styles.post__body}>
          {post.tags.length > 0 && (
            <p className={styles.post__tags}>
              {post.tags.map((tag) => (
                <span key={tag} onClick={() => onClickFetchPosts(tag)}>
                  #{tag}
                </span>
              ))}
            </p>
          )}
          <div className={styles.post__bottom}>
            <div className={styles.post__bottom_right}>
              <PostLikesInfo
                id={post._id}
                likesInfo={{
                  liked: post.liked,
                  disliked: post.disliked,
                  likesCount: post.likesCount,
                  dislikesCount: post.dislikesCount,
                }}
              />
              <button className={styles.post__comments} onClick={handleViewComments}>
                <MessagingSvg />
                {getLikes(post.commentsCount)}
              </button>
            </div>
            <div className={styles.post__views}>
              <ViewsSvg />
              <Link to={`/${FULL_POST_ROUTE}/${post._id}`}>{getViews(post.viewsCount)}</Link>
            </div>
          </div>
        </div>
      </div>
      {isCommentsVisible && <Comments owner={post.user} id={post._id} />}
    </div>
  );
};

export default Post;
