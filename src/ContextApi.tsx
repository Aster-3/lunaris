import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ConfirmModal } from './Modals/ConfirmModal';
import { setGlobalConfirm } from './utils/confirmGlobal';

export type ConfirmContextType = {
  confirm: (title: string, message: string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTitle(title);
      setMessage(message);
      setVisible(true);
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setVisible(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setVisible(false);
  };

  React.useEffect(() => {
    setGlobalConfirm(confirm);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        visible={visible}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
