import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from 'react-icons/io5';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ success: (m) => show(m, 'success'), error: (m) => show(m, 'error'), info: (m) => show(m, 'info') }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-10 duration-500 min-w-[320px] max-w-[400px]
              ${toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-600 text-white' 
                : toast.type === 'error'
                  ? 'bg-rose-500 border-rose-600 text-white'
                  : 'bg-neutral-800 border-neutral-900 text-white'
              }
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' ? <IoCheckmarkCircle size={20} /> : <IoAlertCircle size={20} />}
            </div>
            <div className="flex-1 text-[13px] font-bold tracking-tight leading-tight">
              {toast.message}
            </div>
            <button 
              onClick={() => remove(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoClose size={18} className="opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
