import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import UserSettings from './pages/UserSettings';
import UserProfile from './pages/UserProfile';
import {
  AUTH_ROUTE,
  FULL_POST_ROUTE,
  HOME_ROUTE,
  PHOTO_ROUTE,
  USER_PROFILE_ROUTE,
  USER_SETTINGS_ROUTE,
} from './utils/consts';
import Photo from './pages/Photo';
import FullPost from './pages/FullPost';
import { useAppDispatch } from './redux/store';
import { fetchRefresh } from './redux/auth/asyncActions';
import NewAuth from './pages/NewAuth';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import { useSelector } from 'react-redux';
import { selectIsAuth } from './redux/auth/selectors';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRefresh());
  }, []);

  return (
    <div className="wrapper" id="wrapper">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path={HOME_ROUTE} element={<Home />} />
          {/* <Route path={REGISTER_ROUTE} element={<Registration />} /> */}
          <Route path={FULL_POST_ROUTE + '/:id'} element={<FullPost />} />
          <Route path={USER_SETTINGS_ROUTE} element={<UserSettings />} />
          <Route path={USER_PROFILE_ROUTE + '/:id'} element={<UserProfile />} />
          <Route path={PHOTO_ROUTE} element={<Photo />} />
        </Route>
        <Route path="/user" element={<AuthLayout />}>
          <Route path={AUTH_ROUTE} element={<NewAuth />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${HOME_ROUTE}`} replace />} />
      </Routes>
      <Toaster containerStyle={{ marginTop: 50 }} />
    </div>
  );
};

export default App;
