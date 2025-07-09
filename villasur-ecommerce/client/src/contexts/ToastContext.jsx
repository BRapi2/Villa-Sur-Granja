import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 2000) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          maxWidth: '320px',
          background: '#d7263d',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: '1rem',
          opacity: 0.97,
        }}>
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
} 