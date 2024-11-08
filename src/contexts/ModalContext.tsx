import React, { createContext, useState, ReactNode } from 'react';
import { Worker } from '../types/Worker';
import { ModalType } from '../enums/ModalType';

interface ModalContextProps {
  modalConfig: {
    isOpen: boolean;
    type: ModalType | null;
    worker?: Worker;
  };
  openModal: (type: ModalType, worker?: Worker) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    worker?: Worker;
  }>({
    isOpen: false,
    type: null,
    worker: undefined,
  });

  const openModal = (type: ModalType, worker?: Worker) => {
    setModalConfig({ isOpen: true, type, worker });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null, worker: undefined });
  };

  return (
    <ModalContext.Provider value={{ modalConfig, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

