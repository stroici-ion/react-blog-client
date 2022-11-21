import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { API_IMAGES_URL, USER_PROFILE_ROUTE } from '../../utils/consts';
import styles from './styles.module.scss';

interface IFriendsBlock {
  friends: { avatarUrl: string; fullName: string; id: string }[];
}

const FriendsBlock: React.FC<IFriendsBlock> = ({ friends }) => {
  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Friends</p>
      <div className={styles.root__row}>
        {friends.map((friend, index) => (
          <Link key={index} to={USER_PROFILE_ROUTE}>
            <div className={classNames(styles.root__item, styles.item)}>
              <img
                className={styles.item__img}
                src={API_IMAGES_URL + friend.avatarUrl}
              />
              <p className={styles.item__name}>{friend.fullName}</p>
              {/* <p className={styles.item__name}>{friend.fullName}</p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendsBlock;
