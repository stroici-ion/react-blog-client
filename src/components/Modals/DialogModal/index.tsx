import React from 'react';
import classNames from 'classnames';

import { useGlobalModalContext } from '../GlobalModal';
import styles from './styles.module.scss';
import Modal from '../Modal';

type DialogModalType = {
  title: string;
  callBack: () => void;
};

const DialogModal: React.FC<DialogModalType> = ({ title, callBack }) => {
  const { hideModal } = useGlobalModalContext();

  const handleHideModal = () => {
    hideModal();
  };

  const handleConfirm = () => {
    hideModal();
    callBack();
  };

  return (
    <Modal>
      <h3>{title}</h3>
      <div className={styles.modal__row}>
        <button className={styles.cancelButton} onClick={handleHideModal}>
          Cancel
        </button>
        <button className={styles.yesButton} onClick={handleConfirm}>
          Yes
        </button>
      </div>
    </Modal>
    // <div className={styles.modal}>
    //   <div className={styles.modal__body}>
    //     <button className={styles.modal__closeBtn} onClick={handleHideModal}>
    //       ✖
    //     </button>
    //     <h3>{title}</h3>
    //     <div className={styles.modal__row}>
    //       <button className={styles.cancelButton} onClick={handleHideModal}>
    //         Cancel
    //       </button>
    //       <button className={styles.yesButton} onClick={handleConfirm}>
    //         Yes
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DialogModal;
