let confirmHandler: ((title: string, message: string) => Promise<boolean>) | null = null;

export const setGlobalConfirm = (handler: typeof confirmHandler) => {
  confirmHandler = handler;
};

export const confirm = (title: string, message: string) => {
  if (!confirmHandler) throw new Error('Global confirm handler not set');
  return confirmHandler(title, message);
};
