import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { API_COVER_IMAGES_URL, API_IMAGES_URL } from '../../utils/consts';
import { MessagingSvg, UserSvg } from '../../icons';
import { selectUserData } from '../../redux/auth/selectors';
import { SortByEnum } from '../../redux/search/types';
import { PostType } from '../../models/PostModel';
import FriendsBlock from '../../components/Friends/FriendsBlock';
// import ImagesBlock from '../../components/Images';
import UserInfo from '../../components/UserInfo';
import styles from './styles.module.scss';
import axios from '../../axios';
import Post from '../../components/Post';
import $api from '../../http';

const UserProfile: React.FC = () => {
  const user = useSelector(selectUserData);
  const [activeButton, setAcitveButton] = useState(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);
  const leftBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = {
      searchText: '',
      sortBy: SortByEnum.NEWS,
      userId: user?._id,
      tags: undefined,
      currentPage: 1,
      limit: 100,
    };
    $api.get<{ posts: PostType[]; count: number }>('/posts', { params }).then((res) => {
      setPosts(res.data.posts);
      setCount(res.data.count);
    });
  }, []);

  const isActiveButton = (index: number) => {
    return index === activeButton ? styles.active : '';
  };

  if (!user) return <p>No user</p>;

  return (
    <main className={classNames(styles.main, 'container')}>
      <div className={styles.top}>
        <div
          className={styles.top__coverImage}
          style={{
            backgroundImage: `url('${API_COVER_IMAGES_URL + user.imageCoverUrl}')`,
          }}
        ></div>
        <div className={styles.top__user}>
          <UserInfo user={user} className={styles.top__left} />
          <div className={styles.top__right}>
            <div className={classNames(styles.top__friends, styles.friends)}>
              <h1>{user.fullName}</h1>
              <p className={styles.friends__count}>685 friends * 9 mutal</p>
              <div className={styles.friends__images}>
                <div className={styles.friends__images_box}>
                  <img src={API_IMAGES_URL + user.avatarUrl} />
                </div>
                <div className={styles.friends__images_box}>
                  <img src={API_IMAGES_URL + user.avatarUrl} />
                </div>
                <div className={styles.friends__images_box}>
                  <img src={API_IMAGES_URL + user.avatarUrl} />
                </div>
                <div className={styles.friends__images_box}>
                  <img src={API_IMAGES_URL + user.avatarUrl} />
                </div>
                <div className={styles.friends__images_box}>
                  <img src={API_IMAGES_URL + user.avatarUrl} />
                </div>
              </div>
            </div>
            <div className={classNames(styles.top__actions, styles.actions)}>
              <button className={styles.actions__add}>
                <UserSvg />
                Add Friend
              </button>
              <button className={styles.actions__message}>
                <MessagingSvg />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.body__menu}>
          <span className={styles.body__menu_decoration} style={{ left: 90 * activeButton }}></span>
          <button
            className={classNames(styles.body__menu_button, isActiveButton(0))}
            onClick={() => setAcitveButton(0)}
          >
            Posts
          </button>
          <button
            className={classNames(styles.body__menu_button, isActiveButton(1))}
            onClick={() => setAcitveButton(1)}
          >
            About
          </button>
          <button
            className={classNames(styles.body__menu_button, isActiveButton(2))}
            onClick={() => setAcitveButton(2)}
          >
            Friends
          </button>
          <button
            className={classNames(styles.body__menu_button, isActiveButton(3))}
            onClick={() => setAcitveButton(3)}
          >
            Photos
          </button>
          <button
            className={classNames(styles.body__menu_button, isActiveButton(4))}
            onClick={() => setAcitveButton(4)}
          >
            Videos
          </button>
        </div>
        <div className={classNames(styles.body__content, styles.content)}>
          <div className={styles.content__left}>
            <div
              ref={leftBlockRef}
              className={styles.content__left_body}
              style={
                leftBlockRef.current
                  ? {
                      // top: '10%',
                      bottom: `110%`,
                    }
                  : {}
              }
            >
              {/* <ImagesBlock
                images={[
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                  user.avatarUrl,
                ]}
              /> */}
              <FriendsBlock
                friends={[
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                  {
                    avatarUrl: user.avatarUrl,
                    fullName: user.fullName,
                    id: user._id,
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.content__right}>
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
