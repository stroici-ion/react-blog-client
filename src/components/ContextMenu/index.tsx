import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { SubmenuSvg } from '../../icons';
import SmallButton from '../UI/Buttons/SmallButton';
import styles from './styles.module.scss';

interface IContextMenu {
  children: any;
  className?: string;
  openButton?: any;
}

interface IContextMenuBody {
  children: any;
  className?: string;
  close: () => void;
}

type PopupClick = MouseEvent & {
  path: Node[];
};

const ContextMenu: React.FC<IContextMenu> = ({
  className,
  children,
  openButton,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={classNames(styles.root, className)}>
      {openButton ? (
        openButton(() => setIsVisible(true))
      ) : (
        <SmallButton
          className={styles.root__button}
          onClick={() => setIsVisible(true)}
        >
          <SubmenuSvg />
        </SmallButton>
      )}
      {isVisible && (
        <ContextMenuBody close={() => setIsVisible(false)}>
          {children}
        </ContextMenuBody>
      )}
    </div>
  );
};

const ContextMenuBody: React.FC<IContextMenuBody> = ({ children, close }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [locationStyles, setLocationStyles] = useState({
    left: 'auto',
    right: '0',
    top: 'calc(100% + 5px)',
    bottom: 'auto',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const _event = event as PopupClick;
      if (
        mountedRef.current &&
        ref.current &&
        !_event.path.includes(ref.current)
      ) {
        close();
      }
      mountedRef.current = true;
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (ref.current) {
      const boundsBlock = ref.current.getBoundingClientRect();
      if (boundsBlock.x < 200) {
        setLocationStyles({
          left: '0',
          right: 'auto',
          bottom: 'calc(100% + 5px)',
          top: 'auto',
        });
      }
    }
  }, [ref.current]);

  return (
    <div
      ref={ref}
      style={locationStyles}
      className={styles.root__body}
      onClick={() => close()}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
