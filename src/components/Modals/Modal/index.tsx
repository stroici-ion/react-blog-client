import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import { useGlobalModalContext } from '../GlobalModal';
import styles from './styles.module.scss';

interface IModal {
  className?: string;
  children: any;
  handleClickInside?: any;
  fullSize?: boolean;
  onHide?: () => void;
  closeIcon?: any;
}

const Modal: React.FC<IModal> = ({
  className,
  children,
  handleClickInside,
  fullSize = false,
  onHide,
  closeIcon,
}) => {
  const [mouseDownTarget, setMouseDownTarget] = useState<
    EventTarget & Element
  >();
  const { hideModal } = useGlobalModalContext();

  const handleHideModal = (e: React.MouseEvent) => {
    if (e.currentTarget === mouseDownTarget)
      if (onHide) onHide();
      else hideModal();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownTarget(e.currentTarget);
    e.stopPropagation();
  };

  return (
    <div
      className={classNames(styles.root, className)}
      onMouseDown={handleMouseDown}
      onClick={handleHideModal}
    >
      <div className={styles.root__column}>
        <div
          className={classNames(
            styles.root__body,
            fullSize && styles.fullSize,
            className
          )}
          onMouseDown={handleMouseDown}
          onClick={handleClickInside}
        >
          <button
            onMouseDown={handleMouseDown}
            className={styles.root__closeBtn}
            onClick={handleHideModal}
          >
            {closeIcon || '✖'}
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  handleClickInside: (e: React.MouseEvent) => {
    e.stopPropagation();
  },
};

export default Modal;
