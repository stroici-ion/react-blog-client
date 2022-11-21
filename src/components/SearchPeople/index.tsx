import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { API_IMAGES_URL } from '../../utils/consts';
import { SearchSvg } from '../../icons';
import styles from './styles.module.scss';
import axios from '../../axios';
import Loader from '../Loaders/Loader';
import { UserType } from '../../models/user.model';

interface ISearchPeople {
  className?: string;
  onSelect: (people: UserType) => void;
}

const SearchPeople: React.FC<ISearchPeople> = ({ className, onSelect }) => {
  const [peoples, setPeoples] = useState<UserType[]>([]);

  const [username, setUsername] = useState('');
  const [isPeoplesLoading, setIsPeoplesLoading] = useState(false);

  useEffect(() => {
    setIsPeoplesLoading(true);
    axios.get('/auth', { params: username ? { username } : undefined }).then(({ data }) => {
      setPeoples(data);
      setIsPeoplesLoading(false);
    });
  }, [username]);

  const handleSelectPeople = (people: UserType) => {
    onSelect(people);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.root__top}>
        <input className={styles.root__input} onChange={debouncedChangeHandler} />
        <SearchSvg />
      </div>
      <div className={classNames(styles.root__peoples, styles.peoples)}>
        <div className={styles.peoples__scrollArea}>
          {isPeoplesLoading ? (
            <Loader height={40} />
          ) : peoples.length ? (
            peoples.map((people) => (
              <button
                className={styles.peoples__button}
                key={people._id}
                onClick={() => handleSelectPeople(people)}
              >
                <img className={styles.peoples__avatar} src={API_IMAGES_URL + people.avatarUrl} />
                {people.fullName}
              </button>
            ))
          ) : (
            <div className={styles.peoples__empty}>Not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPeople;
