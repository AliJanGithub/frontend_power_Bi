import React, { createContext, useContext, useState } from 'react';





const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type) => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Listen for global toast events
  React.useEffect(() => {
    const handleToastEvent = (event) => {
      showToast(event.detail.message, event.detail.type);
    };
    
    window.addEventListener('showToast', handleToastEvent );
    
    return () => {
      window.removeEventListener('showToast', handleToastEvent );
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out ${
              toast.type === 'success' 
                ? 'bg-green-600' 
                : toast.type === 'error' 
                ? 'bg-red-600' 
                : 'bg-blue-600'
            }`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Create a global toast object for backward compatibility
(window ).toast = {
  success: (message) => {
    const event = new CustomEvent('showToast', { detail: { message, type: 'success' } });
    window.dispatchEvent(event);
  },
  error: (message) => {
    const event = new CustomEvent('showToast', { detail: { message, type: 'error' } });
    window.dispatchEvent(event);
  }
};