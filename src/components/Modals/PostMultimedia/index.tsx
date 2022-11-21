import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ArrowDownSvg, MessagingSvg, PlaySvg, ViewsSvg } from '../../../icons';
import { selectPost, selectSelectedImageId } from '../../../redux/fullPost/selectors';
import { ImagesType, MultimediaType } from '../../../models/PostModel';
import CommentText from '../../Comments/core/CommentText';
import { getLikes } from '../../../utils/getLikesCount';
import { getTime } from '../../../utils/getTime';
import getViews from '../../../utils/getViews';
import Comments from '../../Comments';
import styles from './styles.module.scss';
import Loader from '../../Loaders/Loader';
import { API_IMAGES_URL, API_MULTIMEDIA_URL, USER_PROFILE_ROUTE } from '../../../utils/consts';
import { getMultimediaById } from '../../../services/PostServices';
import PostLikesInfo from '../../PostLikesInfo';

export const PostMultimedia: React.FC = () => {
  const post = useSelector(selectPost);
  const selectedImageId = useSelector(selectSelectedImageId);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(
    post?.images.find((i) => i._id === selectedImageId)
  );
  const selectedImageIndex = selectedImage && post?.images.indexOf(selectedImage);
  const [multimedia, setMultimedia] = useState<MultimediaType[]>([]);
  const selectedMultimedia = multimedia?.find((item) => item._id === selectedImage?._id);

  useEffect(() => {
    setSelectedImage(post?.images.find((i) => i._id === selectedImageId));
  }, [selectedImageId]);

  useEffect(() => {
    if (
      selectedImage &&
      (!multimedia || !multimedia.map((i) => i._id).includes(selectedImage._id))
    ) {
      getMultimediaById(selectedImage?._id).then((res) => {
        if (multimedia) {
          setMultimedia([...multimedia, res]);
        } else {
          setMultimedia([res]);
        }
      });
    }
  }, [selectedImage]);

  if (!post) {
    return <Loader />;
  }

  const getVideoOrImage = (image: ImagesType) => {
    if (!image.isVideo) {
      return (
        <img
          onClick={() => setSelectedImage(image)}
          key={image._id}
          className={classNames(styles.image, selectedImage?._id === image._id && styles.active)}
          src={API_MULTIMEDIA_URL + image.url}
        />
      );
    } else {
      return (
        <div
          onClick={() => setSelectedImage(image)}
          key={image._id}
          style={{
            background: `url('${API_MULTIMEDIA_URL + image.previewUrl}') center/cover`,
          }}
          className={styles.video}
        >
          <PlaySvg />
        </div>
      );
    }
  };

  const handleSetNextImage = () => {
    if (selectedImageIndex !== undefined && selectedImageIndex < post.images.length - 1) {
      setSelectedImage(post.images[selectedImageIndex + 1]);
    }
  };

  const handleSetPrevImage = () => {
    if (selectedImageIndex !== undefined && selectedImageIndex > 0) {
      setSelectedImage(post.images[selectedImageIndex - 1]);
    }
  };

  return (
    <div className={styles.root__body}>
      <div className={classNames(styles.root__images, styles.images)}>
        <div
          className={styles.images__image}
          style={{
            backgroundImage: `url('${
              API_MULTIMEDIA_URL +
              (selectedImage?.isVideo ? selectedImage?.previewUrl : selectedImage?.url)
            }')`,
          }}
        >
          {selectedImageIndex !== 0 && (
            <button className={styles.images__prev} onClick={handleSetPrevImage}>
              <ArrowDownSvg />
            </button>
          )}
          {selectedImageIndex !== post.images.length - 1 && (
            <button className={styles.images__next} onClick={handleSetNextImage}>
              <ArrowDownSvg />
            </button>
          )}

          {selectedImage?.isVideo ? (
            <video src={API_MULTIMEDIA_URL + selectedImage.url} controls autoPlay />
          ) : (
            <img src={API_MULTIMEDIA_URL + selectedImage?.url} />
          )}
        </div>
        {post.images.length > 1 && (
          <div className={styles.images__bottom}>
            {post.images.map((image) => getVideoOrImage(image))}
          </div>
        )}
      </div>
      <div className={styles.root__right}>
        {selectedMultimedia && (
          <div className={styles.root__scrollArea}>
            <div className={styles.root__top}>
              <div className={styles.root__top_right}>
                <img
                  onClick={() => {
                    navigate('/');
                  }}
                  src={API_IMAGES_URL + post.user.avatarUrl}
                  className={styles.root__avatar}
                />
                <div className={styles.root__info}>
                  <p className={styles.root__fullName}>
                    <Link to={USER_PROFILE_ROUTE + `/${post.user._id}`}>{post.user.fullName}</Link>
                  </p>
                  <p className={styles.root__date}>{getTime(post.createdAt.toString())}</p>
                </div>
              </div>
            </div>
            <h4 className={styles.root__title}>{selectedMultimedia.caption}</h4>
            <div className={styles.root__bottom}>
              <div className={styles.root__bottom_right}>
                <PostLikesInfo
                  setMultimedia={setMultimedia}
                  id={selectedMultimedia._id}
                  isMultimedia={true}
                  likesInfo={{
                    liked: selectedMultimedia.liked,
                    disliked: selectedMultimedia.disliked,
                    likesCount: selectedMultimedia.likesCount,
                    dislikesCount: selectedMultimedia.dislikesCount,
                  }}
                ></PostLikesInfo>
                <div className={styles.root__comments}>
                  <MessagingSvg />
                  {getLikes(selectedMultimedia.commentsCount || 0)}
                </div>
              </div>
              <div className={styles.root__views}>
                <ViewsSvg />
                {getViews(selectedMultimedia.viewsCount || 0)}
              </div>
            </div>
            {selectedImage !== undefined && (
              <Comments isMultimedia={true} id={selectedImage._id} owner={post.user} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
