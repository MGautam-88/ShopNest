import React, { createContext, useContext, useState } from 'react';

const AppMessageContext = createContext(null);

export const AppMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const closeMessage = (result) => {
    if (message?.resolve) {
      message.resolve(result);
    }
    setMessage(null);
  };

  const showAlert = ({ title = 'Message', text, type = 'info', buttonText = 'OK' }) =>
    new Promise((resolve) => {
      setMessage({ mode: 'alert', title, text, type, buttonText, resolve });
    });

  const showConfirm = ({
    title = 'Please confirm',
    text,
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  }) =>
    new Promise((resolve) => {
      setMessage({ mode: 'confirm', title, text, type, confirmText, cancelText, resolve });
    });

  return (
    <AppMessageContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {message && (
        <div className="app-message-overlay">
          <div className={`app-message-box app-message-${message.type}`} role="dialog" aria-modal="true">
            <h3>{message.title}</h3>
            <p>{message.text}</p>
            <div className="app-message-actions">
              {message.mode === 'confirm' && (
                <button type="button" onClick={() => closeMessage(false)} className="app-message-secondary">
                  {message.cancelText}
                </button>
              )}
              <button type="button" onClick={() => closeMessage(true)} className="app-message-primary">
                {message.mode === 'confirm' ? message.confirmText : message.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppMessageContext.Provider>
  );
};

export const useAppMessage = () => {
  const context = useContext(AppMessageContext);
  if (!context) {
    throw new Error('useAppMessage must be used inside AppMessageProvider');
  }
  return context;
};
