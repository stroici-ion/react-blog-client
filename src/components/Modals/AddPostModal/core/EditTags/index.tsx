import React, { useState } from 'react';
import classNames from 'classnames';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';
import { ResetSvg } from '../../../../../icons';

interface IEditTags {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  returnBack: () => void;
}

const EditTags: React.FC<IEditTags> = ({ tags, setTags, returnBack }) => {
  const [tagValue, setTagValue] = useState<string>('');

  const handleAddTag = () => {
    if (!tags.includes(tagValue)) {
      setTags([tagValue, ...tags]);
      setTagValue('');
      return;
    }
    toast.error(`"${tagValue}" - tag is already added!`, {
      style: { lineBreak: 'anywhere' },
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value.match(/^[a-z]*$/) ||
      e.target.value[e.target.value.length - 1].match(/^\c$/)
    )
      setTagValue(e.target.value.toLocaleLowerCase());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className={styles.tags}>
      <p className={styles.title}>Add tags</p>
      <div className={styles.tags__body}>
        <div className={styles.tags__list}>
          {tags.map((tag) => (
            <div key={tag} className={styles.tags__tag}>
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>✖</button>
            </div>
          ))}
        </div>
        <div className={styles.tags__add}>
          <input
            onKeyDown={handleInputKeyDown}
            onChange={handleInputOnChange}
            value={tagValue}
          />
          <button onClick={handleAddTag}>Add tag</button>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.buttons__reset} onClick={() => setTags([])}>
          <ResetSvg />
        </button>
        <button
          className={styles.buttons__post}
          onClick={() => {
            setTagValue('');
            returnBack();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EditTags;
