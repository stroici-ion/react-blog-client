import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const Photo: React.FC = () => {
  const navigate = useNavigate();
  console.log(navigate.length);

  return <div className={styles.root}></div>;
};

export default Photo;
