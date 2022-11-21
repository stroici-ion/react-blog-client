import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { PlaySvg } from '../../../../icons';
import { ImagesType } from '../../../../models/PostModel';
import { useAppDispatch } from '../../../../redux/store';
import styles from './styles.module.scss';

interface IFullVideo {
  small?: boolean;
  fullPost?: boolean;
  setPost?: (imageId: string, videoTime?: number) => void;
  images: ImagesType[];
}

const FullVideo: React.FC<IFullVideo> = ({ images, fullPost, setPost, small }) => {
  const mainVideo = images.find((image) => image.isVideo);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const topVideoRef = useRef<HTMLDivElement>(null);
  const bottomVideoRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(fullPost);
  const [isIntersectedTop, setIsIntersectedTop] = useState(false);
  const [isIntersectedBottom, setIsIntersectedBottom] = useState(false);
  const dispatch = useAppDispatch();

  const squareImages = images.filter(
    (image) => image.aspectRatio >= 0.8 && image.aspectRatio <= 1.2 && image._id !== mainVideo?._id
  );

  const horizontalImages = images.filter(
    (image) => image.aspectRatio > 1.2 && image._id !== mainVideo?._id
  );

  const verticalImages = images.filter(
    (image) => image.aspectRatio < 0.8 && image._id !== mainVideo?._id
  );

  const getSquareImges = () => {
    if (squareImages.length) {
      if (mainVideo && mainVideo.aspectRatio < 1.2) {
        const result = squareImages.slice(0, 1);
        return result;
      }
    }
    return;
  };

  const getVerticalImges = () => {
    if (verticalImages.length) {
      if (mainVideo && mainVideo.aspectRatio <= 1.2) {
        if (!squareImages.length) {
          const result = verticalImages.slice(0, 2);
          return result;
        }
      } else {
        const result = verticalImages.slice(0, 1);
        return result;
      }
    }
    return;
  };

  const nearVideoImages = [...(getSquareImges() || []), ...(getVerticalImges() || [])];

  const otherVideo = [...squareImages, ...verticalImages, ...horizontalImages].filter(
    (image) => !nearVideoImages.map((i) => i._id).includes(image._id)
  );

  const getImageSource = (image?: ImagesType) => {
    if (image) {
      if (image.isVideo) return image.previewUrl;
      return image.url;
    }
  };

  const handlePauseVideo = () => {
    setIsStarted(false);
    mainVideoRef.current?.pause();
  };

  const handlePlayVideo = () => {
    setIsStarted(true);
    mainVideoRef.current?.play();
  };

  const handleVideoOnPlay = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => video !== mainVideoRef.current && video.pause());
  };

  const observerTop = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setIsIntersectedTop(false);
      } else {
        setIsIntersectedTop(true);
      }
    });
  }, {});

  const observerBottom = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setIsIntersectedBottom(false);
      } else {
        setIsIntersectedBottom(true);
      }
    });
  }, {});

  useEffect(() => {
    if (isIntersectedBottom === true && isIntersectedTop === true) handlePlayVideo();
    else handlePauseVideo();
  }, [isIntersectedTop, isIntersectedBottom]);

  useEffect(() => {
    if (!fullPost) {
      if (topVideoRef.current) observerTop.observe(topVideoRef.current);
      if (bottomVideoRef.current) observerBottom.observe(bottomVideoRef.current);
    } else {
      setIsStarted(true);
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.root__row}>
        <div
          className={styles.row__decorationLeft}
          style={{ backgroundImage: `url('${mainVideo?.previewUrl}')` }}
        />
        <div
          className={styles.row__decorationRight}
          style={{
            backgroundImage: `url('${
              nearVideoImages.length
                ? getImageSource(nearVideoImages[nearVideoImages.length - 1])
                : mainVideo?.previewUrl
            }')`,
          }}
        />
        <div
          className={classNames(styles.root__mainVideoBlock, isStarted && styles.started)}
          style={{ backgroundImage: `url('${mainVideo?.previewUrl}')` }}
          onClick={() => {
            handlePauseVideo();
            if (mainVideo && setPost) setPost(mainVideo?._id);
          }}
        >
          <div
            ref={topVideoRef}
            style={{
              top: -1,
              position: 'absolute',
              height: 2,
            }}
          />
          <video
            muted={!fullPost}
            autoPlay={true}
            onPlay={handleVideoOnPlay}
            ref={mainVideoRef}
            src={mainVideo?.url}
            className={classNames(
              styles.root__mainVideoBlock_video,
              fullPost && styles.fullPost,
              small && styles.smallPost
            )}
          />
          {!isStarted && (
            <button className={styles.playVideoButton}>
              <PlaySvg />
            </button>
          )}
          <div
            ref={bottomVideoRef}
            style={{
              bottom: -1,
              position: 'absolute',
              height: 2,
            }}
          />
        </div>
        {nearVideoImages.map((image) => (
          <div key={image._id} className={styles.root__nearVideoBlock}>
            <img
              src={getImageSource(image)}
              className={classNames(
                styles.root__nearVideoBlock_image,
                fullPost && styles.fullPost,
                small && styles.smallPost
              )}
              onClick={() => setPost && setPost(image._id)}
            />
            {image.isVideo && (
              <button className={styles.playVideoButton}>
                <PlaySvg />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className={styles.root__row}>
        <div
          className={styles.row__decorationLeft}
          style={{ backgroundImage: `url('${getImageSource(otherVideo[0])}')` }}
        />
        <div
          className={styles.row__decorationRight}
          style={{
            backgroundImage: `url('${getImageSource(otherVideo[otherVideo.length - 1])}')`,
          }}
        />
        {otherVideo.map((image) => (
          <div
            key={image._id}
            className={classNames(
              styles.root__imageBlock,
              fullPost && styles.fullPost,
              small && styles.smallPost
            )}
          >
            <img
              onClick={() => setPost && setPost(image._id)}
              src={getImageSource(image)}
              className={styles.root__imageBlock_image}
            />
            {image.isVideo && (
              <button className={styles.playVideoButton}>
                <PlaySvg />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullVideo;
