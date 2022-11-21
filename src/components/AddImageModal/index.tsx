import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';

import styles from './styles.module.scss';
import { useSlider } from '../../utils/useSlider';

type AddImageMoadalType = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCropedImage: React.Dispatch<React.SetStateAction<string>>;
  setImageFile: any;
};

const AddImageMoadal: React.FC<AddImageMoadalType> = ({
  setImageFile,
  setIsModalVisible,
  setCropedImage,
}) => {
  const sliderProps = useSlider(1, 10, 0.01, 1);
  const [picture, setPicture] = useState('');
  var editor: AvatarEditor | null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setEditorRef: React.LegacyRef<AvatarEditor> = (ed) => {
    editor = ed;
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const ctx = canvasScaled.getContext('2d');
      if (ctx) {
        // ctx.font = '30px Arial';
        // ctx.strokeText('Hello 😋', 100, 100);
        // ctx.strokeText('Jora 😋', 200, 200);
      }

      try {
        canvasScaled.toBlob(function (blob) {
          if (blob) {
            setImageFile(blob);
            setCropedImage(canvasScaled.toDataURL());
            setIsModalVisible(false);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onClickHidenModal = () => {
    setIsModalVisible(false);
  };

  const handleDrop = (acceptedFiles: any) =>
    setPicture(URL.createObjectURL(acceptedFiles[0]));

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      let url = URL.createObjectURL(e.target.files[0]);
      setPicture(url);
    }
  };

  return (
    <div className={styles.setUserIamge}>
      <div className={styles.setUserIamge__body}>
        <button
          className={styles.setUserIamge__closeBtn}
          onClick={onClickHidenModal}
        >
          ✖
        </button>
        <p className={styles.setUserIamge__title}>Upload profile picture</p>
        <Dropzone onDrop={handleDrop} noClick noKeyboard>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({ className: styles.setUserIamge__dropzone })}
            >
              <input {...getInputProps()} />
              <AvatarEditor
                className={classNames(
                  styles.setUserIamge__editor,
                  picture.length && styles.active
                )}
                color={[255, 255, 255, 0.6]}
                ref={setEditorRef}
                borderRadius={200}
                image={picture}
                height={400}
                width={400}
                border={50}
                scale={sliderProps.value}
              />
              <div
                style={
                  picture.length > 0
                    ? { background: `url(${picture}) center/cover` }
                    : {}
                }
                className={styles.setUserIamge__back}
              >
                Darg and drop image here
              </div>
            </div>
          )}
        </Dropzone>
        <div className={styles.setUserIamge__zoom}>
          <button
            className={classNames(
              styles.setUserIamge__zoomout
              // zoom <= 1.01 && styles.disabled
            )}
            // onClick={() => zoom > 1.01 && setZoom(zoom - 0.07)}
          />
          <input {...sliderProps} />
          <button
            className={styles.setUserIamge__zoomin}
            // onClick={() => setZoom(zoom + 0.07)}
          />
        </div>
        <div className={styles.setUserIamge__buttons}>
          <button
            onClick={onClickHidenModal}
            className={classNames(
              styles.setUserIamge__save,
              'red-btn',
              'red-btn--outline'
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleChooseFile}
            className={classNames(
              styles.setUserIamge__save,
              'blue-btn',
              'blue-btn--outline'
            )}
          >
            Choose file
            <input
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
              hidden
            />
          </button>
          <button
            onClick={handleSave}
            className={classNames(styles.setUserIamge__save, 'blue-btn')}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageMoadal;
