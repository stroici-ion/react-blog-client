import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { BellSvg, SearchSvg } from '../../icons';
import { selectIsAuth } from '../../redux/auth/selectors';
import { AUTH_ROUTE } from '../../utils/consts';
import { MODAL_TYPES, useGlobalModalContext } from '../Modals/GlobalModal';
import styles from './styles.module.scss';

const Navbar: React.FC = () => {
  const { showModal } = useGlobalModalContext();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    showModal(MODAL_TYPES.ADD_POST_MODAL);
  };

  return (
    <header className={styles.root}>
      <h3>Page Title</h3>
      <div className={styles.search}>
        <button>
          <SearchSvg />
        </button>
        <input placeholder="Search" />
      </div>
      <div className={styles.actions}>
        <button className={styles.actions__notifications}>
          <BellSvg />
          <span>3</span>
        </button>
        {isAuth ? (
          <button className={styles.actions__create} onClick={handleCreatePost}>
            Create new post +
          </button>
        ) : (
          <Link to={`/user/${AUTH_ROUTE}`}>
            <button className={styles.actions__create}>Log in</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
