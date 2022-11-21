import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import emoji from 'react-easy-emoji';
import toast from 'react-hot-toast';

import { selectIsAuth, selectUserData } from '../../../redux/auth/selectors';
import { useGlobalModalContext } from '../GlobalModal';
import { feelings, FeelingType } from '../../../utils/emojisMap';
import EditTaggedPeople from './core/EditTaggedPeople';
import { dialogToast } from '../../../utils/toasts';
import { getPostById } from '../../../services/PostServices';
import { PostType } from '../../../models/PostModel';
import ImagesBlock from './core/ImagesBlock';
import EditEmotion from './core/EditEmotion';
import EditIamges from './core/EditImages';
import EditTags from './core/EditTags';
import styles from './styles.module.scss';
import Loader from '../../Loaders/Loader';
import axios from '../../../axios';
import Modal from '../Modal';
import { API_IMAGES_URL, API_MULTIMEDIA_URL, USER_PROFILE_ROUTE } from '../../../utils/consts';
import {
  ImagesVideoSvg,
  ArrowDownSvg,
  TagPeopleSvg,
  FriendsSvg,
  KnownsSvg,
  ResetSvg,
  GlobeSvg,
  TagSvg,
  LockSvg,
  ReturnBackSvg,
  EmojiSvg,
} from '../../../icons';
import { UserType } from '../../../models/user.model';
import $api from '../../../http';

interface IAudienceType {
  id: string;
  title: string;
  icon: JSX.Element;
  colorClass: string;
}

export type ImageFilesType = {
  id: string;
  isVideo: boolean;
  url: string;
  thumbnailUrl: string;
  file?: File;
  thumbnailFile?: File;
  aspectRatio: number;
  caption: string;
};

export type TaggedImagePeople = {
  left: number;
  top: number;
} & UserType;

export type TaggedImage = {
  id: string;
  taggedPeople: TaggedImagePeople[];
};

export enum FormEnum {
  CREATE_POST = 'CREATE_POST',
  EDIT_TAGS = 'EDIT_TAGS',
  EDIT_IMAGES = 'EDIT_IMAGES',
  EDIT_TAGGED_PEOPLE = 'EDIT_TAGGED_PEOPLE',
  EDIT_EMOTION = 'EDIT_EMOTION',
}

const AddPostModal = ({ postId = '' }) => {
  const location = useLocation();
  const wasMounted = useRef(false);
  const { hideModal } = useGlobalModalContext();
  const user = useSelector(selectUserData);
  const isAuth = useSelector(selectIsAuth);
  const audienceTypes = [
    {
      id: '1',
      title: 'Public',
      icon: <GlobeSvg />,
      colorClass: styles.green,
    },
    {
      id: '2',
      title: 'Friends',
      icon: <FriendsSvg />,
      colorClass: styles.lightBlue,
    },
    {
      id: '3',
      title: 'Friends +',
      icon: <KnownsSvg />,
      colorClass: styles.blue,
    },
    {
      id: '0',
      title: 'Only me',
      icon: <LockSvg />,
      colorClass: styles.red,
    },
  ];
  const [emotion, setEmotion] = useState<FeelingType>();
  const [taggedPeople, setTaggedPeople] = useState<UserType[]>([]);
  const [taggedImages, setTaggedImages] = useState<TaggedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState(FormEnum.CREATE_POST);
  const [audienceType, setAudienceType] = useState<IAudienceType>(audienceTypes[0]);
  const [isAudienceTypesVisible, setIsAudienceTypesVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [isAddTitleVisible, setIsAddTitleVisible] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFilesType[]>([]);
  const [isAddImagesVisible, setIsAddImagesVisible] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [rootHeight, setRootHeight] = useState(0);

  useEffect(() => {
    if (wasMounted.current) {
      hideModal();
    }
    wasMounted.current = true;
  }, [location.pathname]);

  const handleChangeActiveFormWithTransition = (form: FormEnum) => {
    setRootHeight(0);
    setTimeout(() => {
      setActiveForm(form);
    }, 400);
  };

  const handleChangeActiveForm = (form: FormEnum) => {
    setActiveForm(form);
  };

  useEffect(() => {
    setRootHeight(650);
  }, [activeForm]);

  useEffect(() => {
    if (postId) {
      getPostById(postId).then((data: PostType) => {
        if (data.text) setText(data.text);
        if (data.title) {
          setIsAddTitleVisible(true);
          setTitle(data.title);
        }
        if (data?.emotion) {
          setEmotion(feelings.find((feeling) => feeling.name === data.emotion));
        }
        if (data.taggedUsers) {
          setTaggedPeople(data.taggedUsers);
        }
        if (data.images.length) {
          const fetchedImages: ImageFilesType[] = data.images.map((image) => {
            return {
              id: image._id,
              isVideo: image.isVideo,
              url: API_MULTIMEDIA_URL + image.url,
              thumbnailUrl: API_MULTIMEDIA_URL + image.previewUrl,
              aspectRatio: image.aspectRatio,
              caption: image.caption,
            };
          });
          setImageFiles(fetchedImages);
          setIsAddImagesVisible(true);
          setTags(data.tags);
          data.images.forEach((image) => {
            const usersId = image.taggedUsers.map((item) => item.userId);
            axios.get<UserType[]>('/users', { params: { usersId } }).then((res) => {
              let feetchedTaggedPeople: TaggedImagePeople[] = [];
              image.taggedUsers.forEach((obj) => {
                const userCandidate = res.data.find((user) => user._id === obj.userId);
                if (userCandidate) {
                  feetchedTaggedPeople.push({
                    top: Number(obj.location.y),
                    left: Number(obj.location.x),
                    _id: obj.userId,
                    fullName: userCandidate.fullName || '',
                    avatarUrl: userCandidate.avatarUrl || '',
                  });
                }
              });

              setTaggedImages((t) => [
                ...t,
                {
                  id: image._id,
                  taggedPeople: feetchedTaggedPeople,
                },
              ]);
            });
          });
        }
      });
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = new FormData();
      fields.set('audienceType', audienceType.id);
      emotion && fields.set('emotion', emotion.name);
      fields.set('title', title);
      fields.set('text', text);
      fields.set('tags', tags.join('#'));
      fields.set(
        'imagesInfo',
        JSON.stringify(
          imageFiles.map((image) => {
            return {
              id: image.id,
              aspectRatio: image.aspectRatio,
              caption: image.caption,
            };
          })
        )
      );
      imageFiles.forEach((image) => {
        fields.append('images', image.file || '');
        fields.append('thumbnails', image.thumbnailFile || '');
      });
      console.log(taggedImages);
      fields.set('taggedImages', JSON.stringify(taggedImages));
      fields.set('taggedPeople', taggedPeople.map((people) => people._id).join('#'));

      if (postId) {
        const { data } = await $api.patch('/posts/' + postId, fields);
        if (data) {
          toast.success('Post was successfully updated');
          hideModal();
        }
      } else {
        const { data } = await $api.post('/posts', fields);
        if (data) {
          toast.success('Post was successfully created');
          hideModal();
        }
      }
    } catch (err) {
      console.warn(err);
      toast.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudienceTypes = (e: React.MouseEvent) => {
    setIsAudienceTypesVisible(!isAudienceTypesVisible);
    e.stopPropagation();
  };

  const handleChangeAudienceType = (item: IAudienceType) => {
    setAudienceType(item);
    setIsAudienceTypesVisible(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    setIsAudienceTypesVisible(false);
    e.stopPropagation();
  };

  const handleToggleAddTitle = () => {
    if (isAddTitleVisible) {
      setIsAddTitleVisible(false);
      setTitle('');
      return;
    }
    setIsAddTitleVisible(true);
  };

  const handleToggleAddImages = () => {
    if (isAddImagesVisible) {
      setIsAddImagesVisible(false);
      setImageFiles([]);
      return;
    }
    setIsAddImagesVisible(true);
  };

  const handleResetForm = () => {
    dialogToast(resetForm, 'Confirm the reset action?', 'Yes');
  };

  const resetForm = () => {
    setIsAddImagesVisible(false);
    setIsAddTitleVisible(false);
    setImageFiles([]);
    setTags([]);
    setText('');
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  const onHideModal =
    activeForm !== FormEnum.CREATE_POST
      ? activeForm !== FormEnum.EDIT_IMAGES
        ? () => {
            handleChangeActiveFormWithTransition(FormEnum.CREATE_POST);
          }
        : () => {
            handleChangeActiveForm(FormEnum.CREATE_POST);
          }
      : undefined;

  return (
    <Modal
      handleClickInside={handleClickInside}
      fullSize={activeForm === FormEnum.EDIT_IMAGES}
      closeIcon={activeForm !== FormEnum.CREATE_POST ? <ReturnBackSvg /> : undefined}
      onHide={onHideModal}
    >
      {isLoading && (
        <div className={styles.loading}>
          <Loader height={50} />
        </div>
      )}
      <div
        className={classNames(styles.root, activeForm === FormEnum.EDIT_IMAGES && styles.fullSize)}
        style={{
          maxHeight: activeForm !== FormEnum.EDIT_IMAGES ? rootHeight : 'none',
        }}
      >
        <div
          className={classNames(
            styles.root__field,
            activeForm === FormEnum.CREATE_POST && styles.active
          )}
        >
          <p className={styles.title}>Create post</p>
          <div className={styles.top}>
            <img className={styles.top__avatar} src={API_IMAGES_URL + user?.avatarUrl} />
            <div className={styles.top__properties}>
              <p className={styles.top__name}>
                <Link to={USER_PROFILE_ROUTE + `/${user?._id}`}>{user?.fullName}</Link>
                {emotion?.name && (
                  <span>
                    {' '}
                    is {emoji(String.fromCodePoint(parseInt(emotion.code, 16)))} feeling{' '}
                    {emotion.name}
                  </span>
                )}
                {taggedPeople.length > 0 && (
                  <>
                    {taggedPeople.map((people, index) => (
                      <>
                        <span> with </span>
                        <Link key={people._id} to={USER_PROFILE_ROUTE + `/${people?._id}`}>
                          {people.fullName}
                        </Link>
                        {index < taggedPeople.length - 1 && <span> and </span>}
                      </>
                    ))}
                  </>
                )}
              </p>
              <div
                className={classNames(styles.top__selectedOption, audienceType.colorClass)}
                onClick={handleToggleAudienceTypes}
              >
                {audienceType.icon}
                {audienceType.title}
                <ArrowDownSvg />
              </div>
              {isAudienceTypesVisible && (
                <div className={styles.top__options}>
                  {audienceTypes
                    .filter((item) => item.id !== audienceType.id)
                    .map((item) => (
                      <div
                        className={classNames(styles.top__option, item.colorClass)}
                        onClick={() => handleChangeAudienceType(item)}
                      >
                        {item.icon} {item.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.root__body}>
            <div className={styles.postTitle}>
              <div className={styles.postTitle__input}>
                {isAddTitleVisible && (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title ..."
                  />
                )}
              </div>
              <button
                className={classNames(styles.postTitle__button, isAddTitleVisible && styles.active)}
                onClick={handleToggleAddTitle}
              >
                {isAddTitleVisible ? '✖' : 'Add post title'}
              </button>
            </div>
            <TextareaAutosize
              style={{ fontSize: 16 }}
              placeholder={`What's on your mind, ${
                user?.fullName.split(' ')[1] || user?.fullName.split(' ')[0]
              }?`}
              className={styles.text}
              value={text}
              onChange={onChange}
            />
            {isAddImagesVisible && (
              <ImagesBlock
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                setEditIamgesForm={() => handleChangeActiveFormWithTransition(FormEnum.EDIT_IMAGES)}
              />
            )}
            {FormEnum.CREATE_POST === activeForm && tags.length > 0 && (
              <div className={styles.post__tags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.post__tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.features}>
            Add to your post
            <div className={styles.features__buttons}>
              <button
                onClick={handleToggleAddImages}
                className={classNames(isAddImagesVisible && styles.active)}
              >
                <ImagesVideoSvg />
              </button>
              <button
                onClick={() => handleChangeActiveFormWithTransition(FormEnum.EDIT_TAGGED_PEOPLE)}
                className={classNames(taggedPeople.length && styles.active)}
              >
                <TagPeopleSvg />
              </button>
              <button
                onClick={() => handleChangeActiveFormWithTransition(FormEnum.EDIT_EMOTION)}
                className={classNames(emotion && styles.active)}
              >
                <EmojiSvg />
              </button>
              <button
                className={classNames(tags.length && styles.active)}
                onClick={() => handleChangeActiveFormWithTransition(FormEnum.EDIT_TAGS)}
              >
                <TagSvg />
              </button>
            </div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.buttons__reset} onClick={handleResetForm}>
              <ResetSvg />
            </button>
            <button className={styles.buttons__post} onClick={onSubmit}>
              {postId ? 'Save' : 'Post'}
            </button>
          </div>
        </div>
        {activeForm === FormEnum.EDIT_TAGS && (
          <EditTags
            returnBack={() => handleChangeActiveFormWithTransition(FormEnum.CREATE_POST)}
            tags={tags}
            setTags={setTags}
          />
        )}
        {activeForm === FormEnum.EDIT_IMAGES && (
          <EditIamges
            taggedImages={taggedImages}
            setTaggedImages={setTaggedImages}
            returnBack={() => handleChangeActiveForm(FormEnum.CREATE_POST)}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
          />
        )}
        {activeForm === FormEnum.EDIT_TAGGED_PEOPLE && (
          <EditTaggedPeople
            taggedPeople={taggedPeople}
            setTaggedPeople={setTaggedPeople}
            returnBack={() => handleChangeActiveFormWithTransition(FormEnum.CREATE_POST)}
          />
        )}
        {activeForm === FormEnum.EDIT_EMOTION && (
          <EditEmotion
            setEmotion={setEmotion}
            returnBack={() => handleChangeActiveFormWithTransition(FormEnum.CREATE_POST)}
          />
        )}
      </div>
    </Modal>
  );
};

export default AddPostModal;
