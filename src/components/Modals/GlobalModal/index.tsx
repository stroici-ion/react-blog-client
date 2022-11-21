import React, { useState, createContext, useContext } from 'react';
import AddPostModal from '../AddPostModal';

import DialogModal from '../DialogModal';

export const MODAL_TYPES = {
  DIALOG_MODAL: 'DIALOG_MODAL',
  ADD_POST_MODAL: 'ADD_POST_MODAL',
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.DIALOG_MODAL]: DialogModal,
  [MODAL_TYPES.ADD_POST_MODAL]: AddPostModal,
};

type GlobalModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: {};
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
  store: {},
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<any> = ({ children }) => {
  const [store, setStore] = useState<any>();
  const { modalType, modalProps } = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
