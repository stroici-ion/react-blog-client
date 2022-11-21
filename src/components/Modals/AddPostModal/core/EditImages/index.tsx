import React, { useEffect, useRef, useState } from 'react';
import FilerobotImageEditor from 'react-filerobot-image-editor';
import TextareaAutosize from 'react-textarea-autosize';
// @ts-ignore
import reactImageSize from 'react-image-size';
import classNames from 'classnames';

import { ImageFilesType, TaggedImage, TaggedImagePeople } from '../..';
import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import { IThumbnail } from 'video-metadata-thumbnails/lib/video/ithumbnail';
import EditTaggedImage from '../EditTaggedImage';
import Loader from '../../../../Loaders/Loader';
import styles from './styles.module.scss';
import {
  ImagesVideoSvg,
  ThumbnailsSvg,
  TagPeopleSvg,
  ResetSvg,
  EditSvg,
  PlaySvg,
} from '../../../../../icons';

interface IEditImage {
  taggedImages: TaggedImage[];
  setTaggedImages: React.Dispatch<React.SetStateAction<TaggedImage[]>>;
  imageFiles: ImageFilesType[];
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFilesType[]>>;
  returnBack: () => void;
}

type CaptionsType = {
  id: string;
  caption: string;
};

type ThumbnailType = {
  blob: Blob;
  url: string;
} | null;

const EditIamges: React.FC<IEditImage> = ({
  imageFiles,
  setImageFiles,
  returnBack,
  taggedImages,
  setTaggedImages,
}) => {
  const [images, setImages] = useState(imageFiles);
  const [videoThumbnails, setVideoThumbnails] = useState<ThumbnailType[]>([]);
  const [isThumbnailsVisible, setIsThumbnailsVisible] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState<ThumbnailType>();
  const [selectedImage, setSelectedImage] = useState(imageFiles[0]);
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isThumbnailsLoading, setIsThumbnailsLoading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string>();
  const inputCustomThumbnailFile = useRef<HTMLInputElement>(null);
  const [isTaggingPeople, setIsTaggingPeople] = useState(true);
  const [editedTaggedImages, setEditedTaggedImages] =
    useState<TaggedImage[]>(taggedImages);
  const currentTaggedPeople = editedTaggedImages.find(
    (image) => image.id === selectedImage.id
  )?.taggedPeople;
  const [captions, setCaptions] = useState<CaptionsType[]>(
    imageFiles.map((image) => {
      return { id: image.id, caption: image.caption };
    })
  );
  const currentCaption = captions.find(
    (caption) => caption.id === selectedImage.id
  );

  const onSave = async (editedImageObject: any) => {
    (editedImageObject?.imageCanvas as HTMLCanvasElement).toBlob(
      async (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const file = new File([blob], selectedImage.id);
          const { width, height } = await reactImageSize(url);
          const aspectRatio = width / height;
          alert(aspectRatio);

          handleResetEditor();
          if (selectedImage.isVideo) {
            setSelectedImage({
              ...selectedImage,
              thumbnailUrl: url,
              thumbnailFile: file,
            });
            setImages(
              images.map((item) =>
                item.id === selectedImage.id
                  ? {
                      ...selectedImage,
                      thumbnailUrl: url,
                      thumbnailFile: file,
                      aspectRatio,
                    }
                  : item
              )
            );
          } else {
            setSelectedImage({ ...selectedImage, url, file, aspectRatio });
            setImages(
              images.map((item) =>
                item.id === selectedImage.id
                  ? { ...selectedImage, url, file, aspectRatio }
                  : item
              )
            );
          }
        }
      }
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((item) => item.id !== id));
  };

  const handleResetImages = () => {
    setCaptions(
      imageFiles.map((image) => {
        return { id: image.id, caption: image.caption };
      })
    );
    setImages(imageFiles);
    setSelectedImage(imageFiles[0]);
    setEditedTaggedImages(taggedImages);
  };

  const handleResetOneImage = (id: string) => {
    setImages(
      images.map((item) =>
        item.id === id ? imageFiles.find((obj) => obj.id === id) || item : item
      )
    );
    const candidateTaggedImage = taggedImages.find((obj) => obj.id === id);
    if (candidateTaggedImage) {
      setEditedTaggedImages(
        editedTaggedImages.map((item) =>
          item.id === id ? candidateTaggedImage : item
        )
      );
    } else {
      setEditedTaggedImages(
        editedTaggedImages.filter((item) => item.id !== id)
      );
    }
  };

  const handleResetEditor = () => {
    setIsEditorLoading(true);
    setTimeout(() => {
      setIsEditorLoading(false);
    }, 1000);
  };

  const getVideoThumbnails = async () => {
    if (selectedImage.file || selectedImage.url) {
      const metadata = await getMetadata(
        selectedImage.file || selectedImage.url
      );
      const thumbnails: IThumbnail[] = await getThumbnails(
        selectedImage.file || selectedImage.url,
        {
          quality: 0.8,
          interval: 1,
          start: 0,
          end: metadata.duration,
        }
      );
      setVideoThumbnails(
        thumbnails.map((item) =>
          item.blob
            ? { url: URL.createObjectURL(item.blob), blob: item.blob }
            : null
        )
      );
      setIsThumbnailsLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedImage.isVideo &&
      isThumbnailsVisible &&
      !videoThumbnails.length
    ) {
      setIsThumbnailsLoading(true);
      getVideoThumbnails();
      setActiveThumbnail(undefined);
    }
  }, [selectedImageId, isThumbnailsVisible]);

  useEffect(() => {
    handleResetEditor();
  }, [activeThumbnail]);

  const handleUploadCustomThumbnail = () => {
    inputCustomThumbnailFile.current?.click();
  };

  const handleChangeCustomThumbnail = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      let url = URL.createObjectURL(e.target.files[0]);
      setIsThumbnailsVisible(false);
      setActiveThumbnail({ url, blob: e.target.files[0] });
    }
  };

  const handleSaveChanges = () => {
    setImageFiles(
      images.map((image) => {
        return {
          ...image,
          caption:
            captions.find((caption) => caption.id === image.id)?.caption || '',
        };
      })
    );
    setTaggedImages(editedTaggedImages);
    returnBack();
  };

  const handleSetEditingImage = (item: ImageFilesType) => {
    if (selectedImage.id !== item.id) {
      handleResetEditor();
      setVideoThumbnails([]);
    }
    setSelectedImage(item);
    setSelectedImageId(item.id);
    setIsTaggingPeople(false);
  };

  const handleSetTaggingImage = (item: ImageFilesType) => {
    if (selectedImage.id !== item.id) {
      handleResetEditor();
      setVideoThumbnails([]);
    }
    setSelectedImage(item);
    setSelectedImageId(item.id);
    setIsTaggingPeople(true);
  };

  const handleRemoveTaggedPeople = (item: TaggedImagePeople) => {
    setEditedTaggedImages(
      editedTaggedImages.map((image) =>
        image.id === selectedImage.id
          ? {
              ...image,
              taggedPeople: image.taggedPeople.filter(
                (people) => people._id !== item._id
              ),
            }
          : image
      )
    );
  };

  const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaptions(
      captions.map((caption) =>
        caption.id === selectedImage.id
          ? { ...caption, caption: e.target.value }
          : caption
      )
    );
  };

  return (
    <div className={styles.root}>
      <p className={styles.title}>Edit images</p>
      <div className={styles.root__body}>
        <div className={styles.root__preview}>
          {!selectedImage.isVideo && isTaggingPeople ? (
            <EditTaggedImage
              url={selectedImage.url}
              id={selectedImage.id}
              editedTaggedImages={editedTaggedImages}
              setEditedTaggedImages={setEditedTaggedImages}
            />
          ) : isEditorLoading ? (
            <Loader height={80} />
          ) : (
            <FilerobotImageEditor
              Text={{ fontSize: 30, stroke: '30' }}
              Pen={{ stroke: '30' }}
              closeAfterSave={true}
              avoidChangesNotSavedAlertOnLeave={true}
              tabsIds={['Adjust', 'Filters', 'Finetune', 'Resize', 'Annotate']}
              onSave={onSave}
              source={
                selectedImage.isVideo
                  ? activeThumbnail
                    ? activeThumbnail.url
                    : selectedImage.thumbnailUrl
                  : selectedImage.url
              }
              defaultTabId={'Filters'}
              savingPixelRatio={4}
              previewPixelRatio={2}
            />
          )}
        </div>
        <div className={classNames(styles.root__toolBar)}>
          <p className={styles.toolBar__title}>Image caption</p>
          <div className={styles.toolBar__scrollArea}>
            <TextareaAutosize
              value={currentCaption?.caption}
              onChange={handleChangeCaption}
              className={styles.toolBar__caption}
              placeholder="Image caption ... "
            />
          </div>
          {selectedImage.isVideo ? (
            <div
              className={classNames(
                styles.thumbnails,
                isThumbnailsVisible && styles.active
              )}
            >
              <div
                className={classNames(
                  styles.thumbnails__scrollArea,
                  isThumbnailsVisible && styles.active
                )}
              >
                <div className={styles.thumbnails__body}>
                  {isThumbnailsLoading
                    ? [...new Array(10)].map((item, index) => (
                        <div className={styles.thumbnails__item}>
                          <div className={styles.thumbnails__skeleton}>
                            <Loader height={30} />
                          </div>
                        </div>
                      ))
                    : videoThumbnails.map(
                        (item) =>
                          item && (
                            <div
                              className={classNames(
                                styles.thumbnails__item,
                                activeThumbnail?.url === item.url &&
                                  styles.active
                              )}
                              onClick={() => setActiveThumbnail(item)}
                            >
                              <img src={item.url} />
                            </div>
                          )
                      )}
                </div>
              </div>
              <button
                className={classNames(styles.thumbnails__button)}
                onClick={() => setIsThumbnailsVisible(!isThumbnailsVisible)}
              >
                <ThumbnailsSvg />
                Select from thumbnails
              </button>
              <button
                className={classNames(styles.thumbnails__button)}
                onClick={handleUploadCustomThumbnail}
              >
                <ImagesVideoSvg />
                <input
                  onChange={handleChangeCustomThumbnail}
                  type="file"
                  hidden
                  ref={inputCustomThumbnailFile}
                />
                Select custom image
              </button>
            </div>
          ) : (
            <div className={styles.imageTools}>
              <p className={styles.toolBar__title}>Tagged people</p>
              <div className={styles.toolBar__scrollArea}>
                <div className={styles.imageTools__list}>
                  {currentTaggedPeople?.map((people) => (
                    <div key={people._id} className={styles.imageTools__tag}>
                      {people.fullName}
                      <button onClick={() => handleRemoveTaggedPeople(people)}>
                        ✖
                      </button>
                    </div>
                  ))}
                  {!currentTaggedPeople?.length && (
                    <p className={styles.imageTools__placeholder}>
                      Click on the image to tag people
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={classNames(styles.root__all, styles.all)}>
          <div className={styles.all__body}>
            <div className={styles.all__images}>
              {images.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: `url('${
                      item.isVideo ? item.thumbnailUrl : item.url
                    }') center/cover`,
                  }}
                  className={classNames(
                    styles.all__image,
                    selectedImage.id === item.id && styles.active
                  )}
                >
                  <img
                    onClick={() => {
                      if (selectedImage.id !== item.id) {
                        handleResetEditor();
                        setVideoThumbnails([]);
                      }
                      setSelectedImage(item);
                      setSelectedImageId(item.id);
                    }}
                    key={item.id}
                    src={item.isVideo ? item.thumbnailUrl : item.url}
                  />
                  {item.isVideo && (
                    <button className={styles.video}>
                      <PlaySvg />
                    </button>
                  )}
                  <div className={styles.decoration} />
                  <button
                    className={styles.remove}
                    onClick={() => handleRemoveImage(item.id)}
                  >
                    ✖
                  </button>
                  <button
                    className={styles.resetOne}
                    onClick={() => handleResetOneImage(item.id)}
                  >
                    <ResetSvg />
                  </button>
                  {!item.isVideo && (
                    <>
                      <button
                        className={styles.tagPeople}
                        onClick={() => handleSetTaggingImage(item)}
                      >
                        <TagPeopleSvg />
                      </button>
                      <button
                        className={styles.edit}
                        onClick={() => handleSetEditingImage(item)}
                      >
                        <EditSvg />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={classNames(styles.buttons, styles.all__buttons)}>
            <button
              className={styles.buttons__reset}
              onClick={handleResetImages}
            >
              <ResetSvg />
            </button>
            <button
              className={styles.buttons__post}
              onClick={handleSaveChanges}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIamges;
