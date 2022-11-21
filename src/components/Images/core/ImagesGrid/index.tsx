import classNames from 'classnames';
import React from 'react';

import { ImagesType } from '../../../../models/PostModel';
import styles from './styles.module.scss';

interface IImagesGrid {
  small?: boolean;
  images: ImagesType[];
  fullPost?: boolean;
  setPost?: (imageId: string, videoTime?: number) => void;
}

const ImagesGrid: React.FC<IImagesGrid> = ({ images, fullPost, setPost, small }) => {
  const sortByAspectRatio = (array: ImagesType[]) => {
    return array.sort((a, b) => b.aspectRatio - a.aspectRatio);
  };

  const mainImage = sortByAspectRatio(images).find((item) => item.aspectRatio < 1.8);

  const horizontalImages = sortByAspectRatio(
    images.filter((image) => image.aspectRatio > 1.2 && image._id !== mainImage?._id)
  );

  const verticalImages = sortByAspectRatio(
    images.filter((image) => image.aspectRatio < 0.8 && image._id !== mainImage?._id)
  );

  const squareImages = sortByAspectRatio(
    images.filter(
      (image) =>
        image.aspectRatio >= 0.8 && image.aspectRatio <= 1.2 && image._id !== mainImage?._id
    )
  );

  const getSquareImges = () => {
    if (squareImages.length) {
      if (mainImage && mainImage.aspectRatio < 1.2) {
        const result = squareImages.slice(0, 1);
        return result;
      }
    }
    return;
  };

  const getVerticalImges = () => {
    if (verticalImages.length) {
      if (mainImage && mainImage.aspectRatio <= 1.2) {
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

  const nearMainImage = [...(getSquareImges() || []), ...(getVerticalImges() || [])];

  const otherImages = [...squareImages, ...verticalImages, ...horizontalImages].filter(
    (image) => !nearMainImage.map((i) => i._id).includes(image._id)
  );

  return (
    <div className={styles.root}>
      <div className={styles.root__row}>
        <div
          className={styles.row__decorationLeft}
          style={{ backgroundImage: `url('${mainImage?.url}')` }}
        />
        <div
          className={styles.row__decorationRight}
          style={{
            backgroundImage: `url('${
              nearMainImage.length ? nearMainImage[nearMainImage.length - 1].url : mainImage?.url
            }')`,
          }}
        />
        <div
          className={classNames(
            styles.root__nearVideoBlock,
            fullPost && styles.fullPost,
            small && styles.smallPost
          )}
        >
          <img
            onClick={() => mainImage && setPost && setPost(mainImage._id)}
            src={mainImage?.url}
            className={styles.root__nearVideoBlock_image}
          />
        </div>
        {nearMainImage.map((image) => (
          <div
            key={image._id}
            className={classNames(
              styles.root__nearVideoBlock,
              fullPost && styles.fullPost,
              small && styles.smallPost
            )}
          >
            <img
              onClick={() => setPost && setPost(image._id)}
              src={image.url}
              className={styles.root__nearVideoBlock_image}
            />
          </div>
        ))}
      </div>
      {otherImages.length > 0 && (
        <div className={styles.root__row}>
          <div
            className={styles.row__decorationLeft}
            style={{ backgroundImage: `url('${otherImages[0].url}')` }}
          />
          <div
            className={styles.row__decorationRight}
            style={{
              backgroundImage: `url('${otherImages[otherImages.length - 1].url}')`,
            }}
          />
          {otherImages.map((image) => (
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
                src={image.url}
                className={styles.root__imageBlock_image}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesGrid;
