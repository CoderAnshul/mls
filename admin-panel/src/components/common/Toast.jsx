import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

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
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-10 duration-500 min-w-[320px] max-w-[400px]
              ${toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : toast.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-admin-accent/10 border-admin-accent/20 text-admin-accent'
              }
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </div>
            <div className="flex-1 text-[13px] font-bold tracking-tight leading-tight">
              <p className="uppercase opacity-60 text-[10px] tracking-widest mb-0.5">
                {toast.type === 'success' ? 'Protocol Success' : 'System Interference'}
              </p>
              {toast.message}
            </div>
            <button 
              onClick={() => remove(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={14} className="opacity-40" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
