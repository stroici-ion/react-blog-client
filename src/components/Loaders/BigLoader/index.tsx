import React from 'react';

import styles from './styles.module.scss';
import loaderGif from '../../../assets/loader.gif';

const BigLoader = () => {
  return (
    <div className={styles.root}>
      <img src={loaderGif} />
    </div>
  );
};

export default BigLoader;
