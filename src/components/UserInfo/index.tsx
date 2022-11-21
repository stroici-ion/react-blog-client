import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { API_IMAGES_URL } from '../../utils/consts';
import { AddressSvg, BirthdaySvg, EmailSvg, PhoneSvg } from '../../icons';
import { UserType } from '../../models/user.model';

interface IUserInfo {
  className?: string;
  user: UserType;
}

const UserInfo: React.FC<IUserInfo> = ({ className, user }) => {
  return (
    <div className={classNames(styles.userInfo, className)}>
      <div className={styles.userInfo__body}>
        <img className={styles.userInfo__avatar} src={API_IMAGES_URL + user.avatarUrl} />
        <p className={styles.userInfo__fullName}></p>
        <div className={styles.userInfo__row}>
          <EmailSvg />
          <p>{user.fullName}</p>
        </div>
        <div className={styles.userInfo__row}>
          <AddressSvg />
          <p>s. Banesti, r. Telenesti</p>
        </div>
        <div className={styles.userInfo__row}>
          <PhoneSvg />
          <p>+373 60497091</p>
        </div>
        <div className={styles.userInfo__row}>
          <BirthdaySvg />
          <p>07.06</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
