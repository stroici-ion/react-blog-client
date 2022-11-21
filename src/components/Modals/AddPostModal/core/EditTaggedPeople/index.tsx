import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';
import { ResetSvg } from '../../../../../icons';

import userEvent from '@testing-library/user-event';
import axios from '../../../../../axios';
import SearchPeople from '../../../../SearchPeople';
import { UserType } from '../../../../../models/user.model';

interface IEditTaggedPeople {
  returnBack: () => void;
  taggedPeople: UserType[];
  setTaggedPeople: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const EditTaggedPeople: React.FC<IEditTaggedPeople> = ({
  returnBack,
  taggedPeople,
  setTaggedPeople,
}) => {
  const [editedTaggedPeople, setEditedTaggedPeople] = useState<UserType[]>(taggedPeople);

  const handleRemoveTaggedPeople = (id: string) => {
    setEditedTaggedPeople(editedTaggedPeople.filter((people) => people._id !== id));
  };

  const onSelectPeople = (people: UserType) => {
    if (!editedTaggedPeople.find((item) => item._id === people._id))
      setEditedTaggedPeople([...editedTaggedPeople, people]);
  };

  return (
    <div className={styles.root}>
      <p className={styles.title}>Add tags</p>
      <div className={styles.root__body}>
        <div className={styles.root__list}>
          <div className={styles.root__scrollArea}>
            {editedTaggedPeople.map((people) => (
              <div key={people._id} className={styles.root__tag}>
                {people.fullName}
                <button onClick={() => handleRemoveTaggedPeople(people._id)}>✖</button>
              </div>
            ))}
          </div>
        </div>
        <SearchPeople className={styles.root__add} onSelect={onSelectPeople} />
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.buttons__reset}
          onClick={() => setEditedTaggedPeople(taggedPeople)}
        >
          <ResetSvg />
        </button>
        <button
          className={styles.buttons__post}
          onClick={() => {
            setTaggedPeople(editedTaggedPeople);
            returnBack();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EditTaggedPeople;
