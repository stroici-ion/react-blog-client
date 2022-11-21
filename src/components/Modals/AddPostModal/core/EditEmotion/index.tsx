import React, { useCallback, useEffect, useState } from 'react';
import emoji from 'react-easy-emoji';
import debounce from 'lodash.debounce';

import styles from './styles.module.scss';
import { SearchSvg } from '../../../../../icons';
import {
  feelings as feelingsList,
  FeelingType,
} from '../../../../../utils/emojisMap';

interface IEditEmotion {
  returnBack: () => void;
  setEmotion: React.Dispatch<React.SetStateAction<FeelingType | undefined>>;
}

const EditEmotion: React.FC<IEditEmotion> = ({ returnBack, setEmotion }) => {
  const [searchText, setSearchText] = useState('');
  const [feelings, setFeelings] = useState<FeelingType[]>(feelingsList);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  const onSelectFeeling = (feeling: FeelingType) => {
    setEmotion(feeling);
    returnBack();
  };

  useEffect(() => {
    setFeelings(feelingsList.filter((item) => item.name.includes(searchText)));
  }, [searchText]);

  return (
    <div className={styles.root}>
      <p className={styles.title}>How are you feeling?</p>
      <div className={styles.root__body}>
        <div className={styles.root__search}>
          <SearchSvg />
          <input
            placeholder="Search feeling"
            className={styles.root__input}
            onChange={debouncedChangeHandler}
          />
        </div>
        <div className={styles.root__emojis}>
          <div className={styles.root__scrollArea}>
            {feelings.map((feeling) => (
              <button
                onClick={() => onSelectFeeling(feeling)}
                className={styles.root__button}
                key={feeling.id}
              >
                <span>
                  {emoji(String.fromCodePoint(parseInt(feeling.code, 16)))}
                </span>
                {feeling.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.buttons__post}
          onClick={() => {
            returnBack();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EditEmotion;
