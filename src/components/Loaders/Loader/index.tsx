import React from 'react';

import styles from './styles.module.scss';
import loaderGif from '../../../assets/icon-loader.gif';

type LoaderType = {
  height?: number;
  size?: number;
};

const Loader: React.FC<LoaderType> = ({ height, size }) => {
  return (
    <div className={styles.loader} style={height ? { height } : {}}>
      <img style={size ? { height: size, width: size } : {}} src={loaderGif} />
    </div>
  );
};

export default Loader;
