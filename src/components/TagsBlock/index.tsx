import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectPosts } from '../../redux/posts/selectors';
import { StatusType } from '../../redux/posts/types';
import { setTag } from '../../redux/search/slice';
import { useAppDispatch } from '../../redux/store';
import styles from './styles.module.scss';

export const TagsBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tags } = useSelector(selectPosts);
  const isTagsLoading = Boolean(tags.status === StatusType.LOADING);

  const onClickTag = (tag: string) => {
    dispatch(setTag(tag));
  };

  return (
    <div className={styles.tags}>
      <h3 className={styles.tags__title}>Tags</h3>
      {tags.items.map((item, index) => (
        <button
          key={index}
          className={classNames(
            isTagsLoading ? styles.tags__skeleton : styles.tags__button
          )}
          children={<span>{item._id}</span>}
          onClick={() => !isTagsLoading && onClickTag(item._id)}
        />
      ))}
    </div>
  );
};
