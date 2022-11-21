import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import React from 'react';
import { v4 } from 'uuid';
// @ts-ignore
import reactImageSize from 'react-image-size';

import { ImageFilesType } from '../..';
import { AddImageVideoSvg, EditSvg } from '../../../../../icons';
import { getExtension, isVideo } from '../../../../../utils/files';
import styles from './styles.module.scss';
import Images from '../../../../Images';

interface IImagesBlock {
  imageFiles: ImageFilesType[];
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFilesType[]>>;
  setEditIamgesForm: () => void;
}

const ImagesBlock: React.FC<IImagesBlock> = ({
  imageFiles,
  setImageFiles,
  setEditIamgesForm,
}) => {
  const getVideoPreview = async (file: File) => {
    if (isVideo(file.name)) {
      const metadata = await getMetadata(file);
      let thumbnail = (
        await getThumbnails(file, {
          quality: 1,
          start: Math.floor(metadata.duration / 2),
          end: Math.floor(metadata.duration / 2),
        })
      )[0];
      return thumbnail.blob;
    }
    return null;
  };

  const prepareFilesToUpload = async (files: File[]) => {
    const newArray: ImageFilesType[] = await Promise.all(
      files.map(async (file: File) => {
        const id = v4();
        const url = URL.createObjectURL(file as File);
        let thumbnailBlob = null;
        let thumbnailUrl = '';
        let isVideoFile = false;
        let aspectRatio = 0;
        const extension = getExtension(file.name);
        if (isVideo(file.name)) {
          isVideoFile = true;
          thumbnailBlob = await getVideoPreview(file);
          if (thumbnailBlob) {
            thumbnailUrl = URL.createObjectURL(thumbnailBlob);
            const { width, height } = await reactImageSize(thumbnailUrl);
            aspectRatio = width / height;
          }
        } else {
          const { width, height } = await reactImageSize(url);
          aspectRatio = width / height;
        }
        const newImageFile: ImageFilesType = {
          id: id + '.' + extension,
          isVideo: isVideoFile,
          url: url,
          thumbnailUrl,
          file: new File([file], id + '.' + extension),
          thumbnailFile: thumbnailBlob
            ? new File([thumbnailBlob], id + '.' + extension)
            : void 0,
          aspectRatio,
          caption: '',
        };
        return newImageFile;
      })
    );

    return newArray;
  };

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: async (acceptedFiles: any) => {
      const newImageFiles = await prepareFilesToUpload(acceptedFiles);
      setImageFiles([...newImageFiles, ...imageFiles]);
    },
  });

  const onClickLoadImage = () => {
    inputRef.current?.click();
  };

  return (
    <div
      {...getRootProps({
        className: styles.images,
      })}
    >
      <div
        onClick={onClickLoadImage}
        className={classNames(
          styles.images__text,
          imageFiles.length && styles.active
        )}
      >
        <AddImageVideoSvg />
        <p>Add Photos/Videos</p>
        {!imageFiles.length && 'or drag and drop here'}
      </div>
      {imageFiles.length > 0 && (
        <button className={styles.images__edit} onClick={setEditIamgesForm}>
          <EditSvg /> Edit images
        </button>
      )}
      <div className={styles.images__dropzone}>
        <input {...getInputProps()} />
        <div
          className={classNames(
            styles.images__body,
            styles[
              `imagesCount${imageFiles.length < 6 ? imageFiles.length : 5}`
            ],
            imageFiles.length > 5 && styles.moreImages
          )}
        >
          {imageFiles.length > 0 ? (
            <Images
              local={true}
              images={imageFiles.map((item) => {
                return {
                  _id: item.id,
                  url: item.url,
                  previewUrl: item.thumbnailUrl,
                  isVideo: item.isVideo,
                  taggedUsers: [
                    {} as {
                      location: { x: string; y: string };
                      userId: string;
                    },
                  ],
                  aspectRatio: item.aspectRatio,
                  caption: item.caption,
                };
              })}
            />
          ) : (
            <div className={styles.imagesSkeleton} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesBlock;
