import React, { useEffect } from 'react';
import classNames from 'classnames';

import { setCurrentPage, setSortBy } from '../../redux/search/slice';
import { fetchPosts, fetchTags } from '../../redux/posts/asyncActions';
import { useAppDispatch } from '../../redux/store';
import { PostSkeleton } from '../../components/Post/Skeleton';
import { selectSearch } from '../../redux/search/selectors';
import { useSelector } from 'react-redux';
import { selectPosts } from '../../redux/posts/selectors';
import { StatusType } from '../../redux/posts/types';
import { SortByEnum } from '../../redux/search/types';
import { SideBlock } from '../../components/SideBlock';
import { PostType } from '../../models/PostModel';
import Pagination from '../../components/Pagination';
import styles from './styles.module.scss';
import Post from '../../components/Post';
import { selectUserAuthStatus } from '../../redux/auth/selectors';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const userAuthStatus = useSelector(selectUserAuthStatus);
  const { posts } = useSelector(selectPosts);
  const isPostsLoading = posts.status === StatusType.LOADING;
  const search = useSelector(selectSearch);
  const totalPages = Math.ceil(posts.items.count / search.limit);
  const limit = useSelector(selectSearch).limit;

  useEffect(() => {
    if (userAuthStatus === 'success') dispatch(fetchPosts(search));
  }, [search, userAuthStatus]);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const onClickSetSortBy = (sortBy: SortByEnum) => {
    dispatch(setSortBy(sortBy));
  };

  const changeCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <main className={classNames(styles.main, 'container')}>
      <div className={styles.main__top}>
        <ul className={styles.main__navButtons}>
          <li>
            <button
              className={classNames(
                styles.main__navButton,
                search.sortBy === SortByEnum.NEWS && styles.active
              )}
              onClick={() => onClickSetSortBy(SortByEnum.NEWS)}
            >
              News
            </button>
          </li>
          <li>
            <button
              className={classNames(
                styles.main__navButton,
                search.sortBy === SortByEnum.POPULAR && styles.active
              )}
              onClick={() => onClickSetSortBy(SortByEnum.POPULAR)}
            >
              Popular
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.main__body}>
        <div className={classNames(styles.main__posts, styles.posts)}>
          {isPostsLoading
            ? [...Array(limit)].map((item, index) => <PostSkeleton key={index} />)
            : posts.items.posts.map((post: PostType) => <Post key={post._id} post={post} />)}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={search.currentPage}
              setCurrentPage={changeCurrentPage}
            />
          )}
        </div>
        <SideBlock />
      </div>
    </main>
  );
};
