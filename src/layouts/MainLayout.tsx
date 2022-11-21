import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ViewPostMultimediaModal from '../components/Modals/ModalTransition';
import { GlobalModal } from '../components/Modals/GlobalModal';
import Navbar from '../components/Navbar';
import Aside from '../components/Aside';

const MainLayout: React.FC = () => {
  return (
    <div className="content">
      <GlobalModal>
        <ViewPostMultimediaModal />
        <Navbar />
        <Aside></Aside>
        <Outlet />
      </GlobalModal>
    </div>
  );
};

export default MainLayout;
