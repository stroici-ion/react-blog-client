import React from 'react';
import { TagsBlock } from '../TagsBlock';

import styles from './styles.module.scss';

export const SideBlock: React.FC = ({}) => {
  return (
    <div className={styles.root}>
      <TagsBlock />
    </div>
  );
};
