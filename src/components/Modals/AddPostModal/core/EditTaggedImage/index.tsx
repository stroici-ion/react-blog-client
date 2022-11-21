import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { API_IMAGES_URL } from '../../../../../utils/consts';
import styles from './styles.module.scss';
import axios from '../../../../../axios';
import { TaggedImage, TaggedImagePeople } from '../..';
import { UserType } from '../../../../../models/user.model';

interface IEditTaggedImage {
  url: string;
  id: string;
  editedTaggedImages: TaggedImage[];
  setEditedTaggedImages: React.Dispatch<React.SetStateAction<TaggedImage[]>>;
}

type BoundsSize = {
  image: { width: number; height: number };
  block: { width: number; height: number };
};

const EditTaggedImage: React.FC<IEditTaggedImage> = ({
  url,
  id,
  editedTaggedImages,
  setEditedTaggedImages,
}) => {
  const selectedLocation = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const [peoples, setPeoples] = useState<UserType[]>();
  const imageRef = useRef<HTMLImageElement>(null);
  const imageBloclRef = useRef<HTMLImageElement>(null);
  const [boundsSize, setBoundsSize] = useState<BoundsSize>({
    image: { width: 0, height: 0 },
    block: { width: 0, height: 0 },
  });
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);
  const [selectionLocation, setSelectionLoacation] = useState<{
    left: string;
    top: string;
  }>({
    left: '0',
    top: '0',
  });

  useEffect(() => {
    axios.get('/auth').then(({ data }) => setPeoples(data));
    const handleResize = () => {
      if (imageRef.current && imageBloclRef.current) {
        const boundsImage = imageRef.current.getBoundingClientRect();
        const boundsBlock = imageBloclRef.current.getBoundingClientRect();
        setBoundsSize({
          image: { width: boundsImage.width, height: boundsImage.height },
          block: { width: boundsBlock.width, height: boundsBlock.height },
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  const handleMouseClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (imageBloclRef.current && imageRef.current) {
      const boundsImage = imageRef.current.getBoundingClientRect();
      const left = ((e.clientX - boundsImage.left) * 100) / boundsImage.width;
      const top = ((e.clientY - boundsImage.top) * 100) / boundsImage.height;
      setIsSelectionVisible(true);
      selectedLocation.current = { top, left };
      setSelectionLoacation(getLocationStyle(top, left) || { left: '0', top: '0' });
    }
  };

  const getLocationStyle = (top: number, left: number) => {
    if (imageRef.current && imageBloclRef.current) {
      const boundsImage = imageRef.current.getBoundingClientRect();
      const boundsBlock = imageBloclRef.current.getBoundingClientRect();

      return {
        left:
          (100 -
            ((boundsSize.image.width || boundsImage.width) * 100) /
              (boundsSize.block.width || boundsBlock.width)) /
            2 +
          (left *
            (((boundsSize.image.width || boundsImage.width) * 100) /
              (boundsSize.block.width || boundsBlock.width))) /
            100 +
          '%',
        top:
          (100 -
            ((boundsSize.image.height || boundsImage.height) * 100) /
              (boundsSize.block.height || boundsBlock.height)) /
            2 +
          (top *
            (((boundsSize.image.height || boundsImage.height) * 100) /
              (boundsSize.block.height || boundsBlock.height))) /
            100 +
          '%',
      };
    }
  };

  const handleTagPeople = (people: UserType) => {
    if (selectedLocation.current && people) {
      const taggedImageCandidate = editedTaggedImages.find((item) => item.id === id);
      if (taggedImageCandidate) {
        const taggedCandidate = taggedImageCandidate.taggedPeople.find(
          (obj) => obj._id === people._id
        );
        let newTaggedPeople: TaggedImagePeople[] = [];
        if (taggedCandidate) {
          newTaggedPeople = taggedImageCandidate.taggedPeople.map((obj) =>
            obj._id === people._id
              ? {
                  ...selectedLocation.current,
                  ...people,
                }
              : obj
          );
        }
        const newTaggedImage = {
          id,
          taggedPeople: newTaggedPeople.length
            ? newTaggedPeople
            : [...taggedImageCandidate.taggedPeople, { ...selectedLocation.current, ...people }],
        };

        setEditedTaggedImages(
          editedTaggedImages.map((item) =>
            item.id === taggedImageCandidate.id ? newTaggedImage : item
          )
        );
      } else {
        const newTaggedImage = {
          id,
          taggedPeople: [{ ...selectedLocation.current, ...people }],
        };

        setEditedTaggedImages([...editedTaggedImages, newTaggedImage]);
      }
      setIsSelectionVisible(false);
    }
  };

  const handleRemoveTaggedPerson = (userId: string) => {
    setEditedTaggedImages(
      editedTaggedImages.map((item) =>
        item.id === id
          ? {
              id,
              taggedPeople: item.taggedPeople.filter((obj) => obj._id !== userId),
            }
          : item
      )
    );
  };

  return (
    <div
      ref={imageBloclRef}
      className={styles.root}
      style={{ background: `url('${url}') center/cover` }}
    >
      <div className={styles.decoration} />
      <img
        draggable={false}
        ref={imageRef}
        className={styles.root__image}
        onClick={handleMouseClick}
        src={url}
      />
      <div
        style={{
          top: selectionLocation.top,
          left: selectionLocation.left,
        }}
        className={classNames(styles.selection, isSelectionVisible && styles.visible)}
      >
        <div
          className={classNames(
            styles.selection__body,
            100 - Number(selectionLocation.top.replace('%', '')) < 30 && styles.above
          )}
        >
          {peoples?.map((people) => (
            <button
              className={styles.selection__button}
              key={people._id}
              onClick={() => handleTagPeople(people)}
            >
              <img className={styles.selection__avatar} src={API_IMAGES_URL + people.avatarUrl} />
              {people.fullName}
            </button>
          ))}
        </div>
      </div>
      <div>
        {editedTaggedImages
          .find((obj) => obj.id === id)
          ?.taggedPeople?.map((item) => (
            <div
              key={item._id}
              style={getLocationStyle(item.top, item.left)}
              className={classNames(styles.taggedPeople, item.top > 90 && styles.reverse)}
            >
              <button
                className={styles.taggedPeople__removeBtn}
                onClick={() => handleRemoveTaggedPerson(item._id)}
              >
                ✖
              </button>
              <p className={styles.taggedPeople__text}>{item.fullName}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EditTaggedImage;
