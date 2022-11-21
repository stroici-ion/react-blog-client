import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import emoji from 'react-easy-emoji';

import { API_IMAGES_URL, API_MULTIMEDIA_URL, USER_PROFILE_ROUTE } from '../../utils/consts';
import { setTag } from '../../redux/search/slice';
import { fetchPosts, fetchRemovePost } from '../../redux/posts/asyncActions';
import { selectUserAuthStatus, selectUserData } from '../../redux/auth/selectors';
import { useAppDispatch } from '../../redux/store';
import { getLikes } from '../../utils/getLikesCount';
import { PostType } from '../../models/PostModel';
import { feelings } from '../../utils/emojisMap';
import { getTime } from '../../utils/getTime';
import DeleteSvg from '../../icons/DeleteSvg';
import getViews from '../../utils/getViews';
import styles from './styles.module.scss';
import { EditSvg, LikeSvg, MessagingSvg, ReportSvg, ViewsSvg } from '../../icons';
import { setPost } from '../../redux/fullPost/slice';
import { MODAL_TYPES, useGlobalModalContext } from '../../components/Modals/GlobalModal';
import ContextMenu from '../../components/ContextMenu';
import CommentText from '../../components/Comments/core/CommentText';
import Images from '../../components/Images';
import PostLikesInfo from '../../components/PostLikesInfo';
import Comments from '../../components/Comments';
import { getPostById } from '../../services/PostServices';
import Loader from '../../components/Loaders/Loader';
import DateSvg from '../../icons/DateSvg';
import { selectSearch } from '../../redux/search/selectors';
import { selectPosts } from '../../redux/posts/selectors';
import { StatusType } from '../../redux/posts/types';
import { PostSkeleton } from '../../components/Post/Skeleton';
import Post from '../../components/Post';
import PreviewPost from '../../components/PreviewPost';
import classNames from 'classnames';

interface IPost {}

const FullPost: React.FC<IPost> = () => {
  const [localPost, setLocalPost] = useState<PostType>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const userData = useSelector(selectUserData);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const userAuthStatus = useSelector(selectUserAuthStatus);
  const search = useSelector(selectSearch);
  const { posts } = useSelector(selectPosts);
  const isPostsLoading = posts.status === StatusType.LOADING;
  const limit = useSelector(selectSearch).limit;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsPostLoading(true);
      getPostById(id)
        .then((res) => setLocalPost(res))
        .finally(() => setIsPostLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (userAuthStatus === 'success') dispatch(fetchPosts(search));
  }, [search, userAuthStatus]);

  if (isPostLoading) return <Loader size={70} />;
  if (!localPost) return <h1>ERROR 404. POST NOT FOUND</h1>;

  const handleRemovePost = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure you want to delete this post?',
      callBack: () => dispatch(fetchRemovePost(localPost._id)),
    });
  };

  const handleEditPost = () => {
    showModal(MODAL_TYPES.ADD_POST_MODAL, {
      postId: localPost._id,
    });
  };

  const onClickFetchPosts = (tag: string) => {
    dispatch(setTag(tag));
    navigate('/');
  };

  const handleSetPost = (imageId: string) => {
    dispatch(setPost({ post: localPost, imageId }));
  };

  return (
    <div className={styles.root}>
      <div className={styles.root__left}>
        <div className={styles.post}>
          <div className={styles.post__content}>
            <div>
              <Images setPost={handleSetPost} fullPost={true} images={localPost.images} />
            </div>
            <div className={styles.post__body}>
              {localPost.tags.length > 0 && (
                <p className={styles.post__tags}>
                  {localPost.tags.map((tag) => (
                    <span key={tag} onClick={() => onClickFetchPosts(tag)}>
                      #{tag}
                    </span>
                  ))}
                </p>
              )}
              <h4 className={styles.post__title}>{localPost.title}</h4>
              <div className={styles.post__bottom}>
                <div className={styles.post__bottom_left}>
                  <div className={styles.post__views}>
                    <ViewsSvg />
                    {getViews(localPost.viewsCount)}
                  </div>
                  <div className={styles.post__date}>
                    <DateSvg />
                    {getTime(localPost.createdAt.toString())}
                  </div>
                </div>
                <div className={styles.post__bottom_right}>
                  <PostLikesInfo
                    id={localPost._id}
                    likesInfo={{
                      liked: localPost.liked,
                      disliked: localPost.disliked,
                      likesCount: localPost.likesCount,
                      dislikesCount: localPost.dislikesCount,
                    }}
                  />
                  <ContextMenu className={styles.post__submenu}>
                    {userData?._id === localPost.user._id ? (
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
              </div>
              <div className={styles.post__top}>
                <div className={styles.post__top_right}>
                  <img
                    onClick={() => {
                      navigate(USER_PROFILE_ROUTE + '/' + localPost.user._id);
                    }}
                    src={API_IMAGES_URL + localPost.user.avatarUrl}
                    className={styles.post__avatar}
                  />
                  <div className={styles.post__info}>
                    <p className={styles.post__fullName}>
                      <Link to={USER_PROFILE_ROUTE + `/${localPost.user._id}`}>
                        {localPost.user.fullName}
                      </Link>
                      {localPost.emotion && (
                        <span>
                          <span> is </span>
                          {emoji(
                            String.fromCodePoint(
                              parseInt(
                                feelings.find((item) => item.name === localPost.emotion)?.code ||
                                  '',
                                16
                              )
                            )
                          )}{' '}
                          feeling {localPost.emotion}
                          {!localPost.taggedUsers.length && <span>.</span>}
                        </span>
                      )}
                      {localPost.taggedUsers.length > 0 && (
                        <>
                          {!localPost.emotion && <span> is</span>}
                          {localPost.taggedUsers.map((people, index) => (
                            <React.Fragment key={people._id}>
                              <span>
                                {index === 0
                                  ? ' with '
                                  : index === localPost.taggedUsers.length - 1
                                  ? ' and '
                                  : ', '}
                              </span>
                              <Link to={USER_PROFILE_ROUTE + `/${people?._id}`}>
                                {people.fullName}
                              </Link>
                              {index === localPost.taggedUsers.length - 1 && <span>.</span>}
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </p>
                    <p className={styles.post__followers}>102K followers</p>
                  </div>
                </div>
              </div>
              <div className={styles.post__text}>
                <CommentText text={localPost.text} />
              </div>
            </div>
          </div>
          <Comments owner={localPost.user} id={localPost._id} />
        </div>
      </div>
      <div className={classNames(styles.root__right, styles.postsPreview)}>
        {posts.items.posts.map((post: PostType) => (
          <PreviewPost className={styles.postsPreview__post} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FullPost;
