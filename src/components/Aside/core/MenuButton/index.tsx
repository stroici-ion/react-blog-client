import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

interface IMenuButton {
  icon: any;
  children?: any;
  active?: boolean;
  onClick: any;
}

const MenuButton: React.FC<IMenuButton> = ({
  active = false,
  children,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.root, active && styles.active)}
    >
      {icon()}
      {children}
    </button>
  );
};

export default MenuButton;
