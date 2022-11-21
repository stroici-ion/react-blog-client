import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/auth/selectors';
import AddImageMoadal from '../../components/AddImageModal';
import { useAppDispatch } from '../../redux/store';
import { fetchUpdate } from '../../redux/auth/asyncActions';
import { API_COVER_IMAGES_URL, API_IMAGES_URL } from '../../utils/consts';
import { EditSvg } from '../../icons';

const UserSettings: React.FC = () => {
  const user = useSelector(selectUserData);
  const dispatch = useAppDispatch();

  const [cropedImage, setCropedImage] = useState('');
  const [imageFile, setImageFile] = useState<Blob>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const inputCoverImageRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState({ value: '', enabled: false });
  const [password, setPassword] = useState({
    value: '*********',
    enabled: false,
  });

  const currentAvatarUrl = cropedImage.length > 0 ? cropedImage : API_IMAGES_URL + user?.avatarUrl;
  const currentCoverImageUrl =
    coverImageUrl.length > 0 ? coverImageUrl : API_COVER_IMAGES_URL + user?.imageCoverUrl;

  useEffect(() => {
    if (user && user.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  useEffect(() => {
    if (coverImageFile) setCoverImageUrl(URL.createObjectURL(coverImageFile));
  }, [coverImageFile]);

  const onClickShowModal = () => {
    setIsModalVisible(true);
  };

  const onClickSaveChanges = () => {
    const formData = new FormData();
    if (fullName) {
      formData.set('fullName', fullName);
    }
    if (coverImageFile) {
      formData.set('imageCover', coverImageFile);
    }
    if (imageFile) {
      formData.set('image', imageFile);
    }
    dispatch(fetchUpdate(formData));
  };

  const onChangeCoverImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target) {
      setCoverImageFile(e.target.files?.[0]);
    }
  };

  return (
    <main className={styles.main}>
      <div className={classNames(styles.main__body, 'container')}>
        <div className={styles.userImage}>
          <div
            className={styles.userImage__coverImage}
            style={{ backgroundImage: `url('${currentCoverImageUrl}')` }}
          >
            <button onClick={() => inputCoverImageRef.current?.click()}>Add image</button>
            <input
              onChange={onChangeCoverImage}
              ref={inputCoverImageRef}
              type="file"
              accept="image/*"
              hidden
            ></input>
          </div>
          <div className={styles.userImage__preview}>
            <img className={styles.userImage__image} src={currentAvatarUrl} />
            <button className={styles.userImage__add} onClick={onClickShowModal} />
          </div>
        </div>
        <div className={styles.userData}>
          <div className={styles.userData__row}>
            <span>Full name</span>
            <input
              className={styles.active}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <button className={classNames(styles.userData__changeButton, styles.active)} />
          </div>
          <div className={styles.userData__row}>
            <span>Email</span>
            <input
              className={classNames(email.enabled && styles.active)}
              value={email.value}
              onChange={(e) => setEmail({ value: e.target.value, enabled: email.enabled })}
            />
            <button
              className={styles.userData__changeButton}
              onClick={() => setEmail({ value: email.value, enabled: !email.enabled })}
            />
          </div>
          <div className={styles.userData__row}>
            <span>Password</span>
            <input
              className={classNames(password.enabled && styles.active)}
              type="password"
              value={password.value}
              onChange={(e) =>
                setPassword({
                  value: e.target.value,
                  enabled: password.enabled,
                })
              }
            />
            <button
              className={styles.userData__changeButton}
              onClick={() => setEmail({ value: password.value, enabled: !password.enabled })}
            >
              <EditSvg />
            </button>
          </div>
        </div>
        <button className={classNames(styles.saveChanges, 'blue-btn')} onClick={onClickSaveChanges}>
          Save changes
        </button>
      </div>
      {isModalVisible && (
        <AddImageMoadal
          setImageFile={setImageFile}
          setIsModalVisible={setIsModalVisible}
          setCropedImage={setCropedImage}
        />
      )}
    </main>
  );
};

export default UserSettings;
