import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker, { IEmojiData } from 'emoji-picker-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import toast from 'react-hot-toast';

import { selectUserData } from '../../../../redux/auth/selectors';
import { API_IMAGES_URL } from '../../../../utils/consts';
import styles from './styles.module.scss';
import { EmojiSvg } from '../../../../icons';
import Loader from '../../../Loaders/Loader';

type WriteCommentType = {
  initialValue?: string;
  sendComment: (value: string) => Promise<void>;
  isReply?: boolean;
  isEditing?: boolean;
  hide?: () => void;
};

const WriteComment: React.FC<WriteCommentType> = ({
  isReply = false,
  isEditing = false,
  sendComment,
  initialValue = '',
  hide,
}) => {
  const user = useSelector(selectUserData);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef(null);

  const [value, setValue] = useState(initialValue);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isActive, setIsActive] = useState(isReply);

  const addCommentButtonText = isReply
    ? 'Reply'
    : isEditing
    ? 'Save'
    : 'Comment';

  useEffect(() => {
    if (textareaRef.current && hide) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [textareaRef.current]);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (
        !e.path.includes(emojiPickerRef.current) &&
        !e.path.includes(textareaRef.current)
      ) {
        setIsEmojiPickerVisible(false);
      }
    };
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('click', clickOutside);
    };
  }, []);

  const onEmojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    emojiObject: IEmojiData
  ) => {
    if (emojiObject?.emoji) {
      const atEnd = value.length - cursorPosition;
      const textBeforeCursorPosition = value.substring(0, cursorPosition);
      const textAfterCursorPosition = value.substring(
        cursorPosition,
        value.length
      );
      const currentText =
        textBeforeCursorPosition + emojiObject.emoji + textAfterCursorPosition;
      setValue(currentText);
      setCursorPosition(currentText.length - atEnd);
    }
  };

  const onKeydown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    }
  };

  const onClickToggleEmojiPickerVisibility = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const onClickCancel = () => {
    hide?.();
    setIsActive(false);
    setValue('');
    setIsEmojiPickerVisible(false);
    setCursorPosition(0);
  };

  const onClickSendComment = () => {
    if (!value.length) {
      toast.error('Comment must be not empty!');
      return;
    }
    sendComment(value);
  };

  return (
    <div
      className={classNames(
        styles.addComment,
        !isEditing && styles.withPadding
      )}
    >
      {!isEditing && (
        <img
          src={API_IMAGES_URL + user?.avatarUrl}
          className={classNames(
            styles.addComment__image,
            isReply && styles.isReply
          )}
        />
      )}
      <div className={styles.addComment__writeBlock}>
        <TextareaAutosize
          onFocus={() => setIsActive(true)}
          onBlur={(e) => setCursorPosition(e.target.selectionStart)}
          value={value}
          onKeyDown={onKeydown}
          onChange={(e) => setValue(e.target.value)}
          ref={textareaRef}
          placeholder={`Enter ${isReply ? 'reply' : 'comment'} text`}
          className={classNames(
            styles.addComment__text,
            isReply && styles.isReply
          )}
        />
        <div className={styles.addComment__bottom}>
          <div
            className={classNames(
              styles.addComment__bottom_body,
              isActive && styles.active
            )}
          >
            <div ref={emojiPickerRef}>
              <button
                className={styles.addComment__emojiButton}
                onClick={onClickToggleEmojiPickerVisibility}
              >
                <EmojiSvg />
              </button>
              {isEmojiPickerVisible && (
                <div className={styles.addComment__emojiPicker}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <div>
              <button
                ref={buttonRef}
                className={classNames(
                  styles.addComment__button,
                  isReply && styles.isReply,
                  styles.cancelButton
                )}
                onClick={onClickCancel}
              >
                Cancel
              </button>
              <button
                ref={buttonRef}
                className={classNames(
                  styles.addComment__button,
                  isReply && styles.isReply,
                  styles.yesButton
                )}
                onClick={onClickSendComment}
              >
                {addCommentButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
