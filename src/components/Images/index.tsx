import classNames from 'classnames';
import React from 'react';

import { API_MULTIMEDIA_URL } from '../../utils/consts';
import { ImagesType } from '../../models/PostModel';
import ImagesGrid from './core/ImagesGrid';
import FullVideo from './core/FullVideo';
import styles from './styles.module.scss';

interface IImages {
  small?: boolean;
  setPost?: (imageId: string, videoTime?: number) => void;
  fullPost?: boolean;
  images: ImagesType[];
  local?: boolean;
}

const Images: React.FC<IImages> = ({ images, local, fullPost, setPost, small }) => {
  const fullVideo = images.find((image) => image.isVideo);
  const newImages = !local
    ? images.map((image) => {
        return {
          ...image,
          url: API_MULTIMEDIA_URL + image.url,
          previewUrl: API_MULTIMEDIA_URL + image.previewUrl,
        };
      })
    : images;

  return (
    <div className={classNames(styles.root)}>
      {fullVideo && (
        <FullVideo small={small} setPost={setPost} fullPost={fullPost} images={newImages} />
      )}
      {!fullVideo && (
        <ImagesGrid small={small} setPost={setPost} fullPost={fullPost} images={newImages} />
      )}
    </div>
  );
};

export default Images;
