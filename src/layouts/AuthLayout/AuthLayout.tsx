import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { LogoSvg } from '../../icons';
import { HOME_ROUTE } from '../../utils/consts';
import styles from './styles.module.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="fullscreen">
      <Link to={`/${HOME_ROUTE}`} className={styles.home}>
        <LogoSvg />
        Lobstery
      </Link>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
