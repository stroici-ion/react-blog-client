import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { selectIsFullPostVisible } from '../../../redux/fullPost/selectors';
import { PostMultimedia } from '../PostMultimedia';
import { useAppDispatch } from '../../../redux/store';
import { hideFullPost } from '../../../redux/fullPost/slice';
import styles from './styles.module.scss';
import Modal from '../Modal';

const ViewPostMultimediaModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isFullPostVisible = useSelector(selectIsFullPostVisible);

  return (
    <Modal
      onHide={() => dispatch(hideFullPost())}
      className={classNames(styles.root, isFullPostVisible && styles.isVisible)}
      fullSize={true}
    >
      {isFullPostVisible && <PostMultimedia />}
    </Modal>
  );
};

export default ViewPostMultimediaModal;
