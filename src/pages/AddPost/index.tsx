import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useSelector } from 'react-redux';

import { selectIsAuth } from '../../redux/auth/selectors';
import styles from './styles.module.scss';
// import SimpleMDE from 'react-simplemde-editor';
// import 'easymde/dist/easymde.min.css';
import classNames from 'classnames';
import axios from '../../axios';
import { API_URL } from '../../utils/consts';

export const AddPost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.log(err);
          alert('Failed to get post data');
        });
    }
  }, []);

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      alert('Failed to upload image');
      return;
    }
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert('Failed to upload image');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = useCallback((value: any) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        tags: tags.split(','),
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Failed to create post');
    }
  };

  const onClickLoadImage = () => {
    inputFileRef.current?.click();
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <main className={styles.main}>
      <div className={classNames(styles.main__body, 'container')}>
        <button
          onClick={onClickLoadImage}
          className={classNames(
            styles.addImageBtn,
            'blue-btn',
            'blue-btn--outline'
          )}
        >
          Add image
        </button>
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleChangeFile}
          hidden
        />
        {imageUrl && (
          <>
            <button
              className={classNames(
                styles.deleteImageBtn,
                'red-btn',
                'red-btn--outline'
              )}
              onClick={onClickRemoveImage}
            >
              Delete
            </button>
            <img
              className={styles.image}
              src={API_URL + imageUrl}
              alt="Uploaded"
            />
          </>
        )}

        <br />
        <br />
        <input
          className={styles.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
        />
        <input
          className={styles.tags}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags"
        />
        <TextareaAutosize
          className={styles.editor}
          value={text}
          onChange={onChange}
        />
        <div className={styles.buttons}>
          <button className={'blue-btn'} onClick={onSubmit}>
            {isEditing ? 'Save modifications' : 'Post'}
          </button>
          <a href="/">
            <button className={'red-btn'}>Cancel</button>
          </a>
        </div>
      </div>
    </main>
  );
};
