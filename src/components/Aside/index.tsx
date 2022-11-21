import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { MODAL_TYPES, useGlobalModalContext } from '../Modals/GlobalModal';
import { selectUserData } from '../../redux/auth/selectors';
import { useAppDispatch } from '../../redux/store';
import ContextMenu from '../ContextMenu';
import MenuButton from './core/MenuButton';
import { logout } from '../../redux/auth/slice';
import styles from './styles.module.scss';
import {
  API_IMAGES_URL,
  AUTH_ROUTE,
  HOME_ROUTE,
  USER_PROFILE_ROUTE,
  USER_SETTINGS_ROUTE,
} from '../../utils/consts';
import {
  HomeSvg,
  GallerySvg,
  MessagingSvg,
  SettingsSvg,
  LogoSvg,
  LogOutSvg,
} from '../../icons';

const Aside: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUserData);
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const [activeButton, setAcitveButton] = useState(0);

  const onClickLogout = () => {
    showModal(MODAL_TYPES.DIALOG_MODAL, {
      title: 'Are you sure you want to log out?',
      callBack: handleLogout,
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate(`/user/${AUTH_ROUTE}`);
  };

  return (
    <aside className={styles.header}>
      <Link to="/home">
        <div className={styles.header__logo}>
          <LogoSvg />
        </div>
      </Link>
      <div className={styles.header__buttons}>
        <span
          className={styles.header__buttons_decoration}
          style={{ top: 40 + 70 * activeButton }}
        />
        <Link to={`/${USER_PROFILE_ROUTE}/${user?._id}`}>
          <MenuButton
            onClick={() => setAcitveButton(0)}
            active={activeButton === 0}
            icon={HomeSvg}
          />
        </Link>
        <Link to={`/${HOME_ROUTE}`}>
          <MenuButton
            onClick={() => setAcitveButton(1)}
            active={activeButton === 1}
            icon={GallerySvg}
          />
        </Link>
        <Link to={`/${HOME_ROUTE}`}>
          <MenuButton
            onClick={() => setAcitveButton(2)}
            active={activeButton === 2}
            icon={MessagingSvg}
          />
        </Link>
        <Link to={`/${USER_SETTINGS_ROUTE}`}>
          <MenuButton
            onClick={() => setAcitveButton(3)}
            active={activeButton === 3}
            icon={SettingsSvg}
          />
        </Link>
      </div>
      {user !== null && (
        <div className={classNames(styles.header__user, styles.user)}>
          <ContextMenu
            openButton={(onClick: any) => (
              <button className={styles.user__openMenuButton} onClick={onClick}>
                <img
                  className={styles.user__img}
                  src={API_IMAGES_URL + user?.avatarUrl}
                />
              </button>
            )}
          >
            <button
              className={classNames(styles.user__button, styles.profile)}
              onClick={() => navigate(`/${USER_PROFILE_ROUTE}/${user?._id}`)}
            >
              <HomeSvg />
              Profile
            </button>
            <button
              className={classNames(styles.user__button, styles.logout)}
              onClick={onClickLogout}
            >
              <LogOutSvg />
              Log out
            </button>
          </ContextMenu>
        </div>
      )}
    </aside>
  );
};

export default Aside;
