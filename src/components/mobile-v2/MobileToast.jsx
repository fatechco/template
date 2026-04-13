import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const STYLES = {
  success: { bg: "#D1FAE5", border: "#6EE7B7", icon: CheckCircle,    iconColor: "#059669" },
  error:   { bg: "#FEE2E2", border: "#FCA5A5", icon: XCircle,        iconColor: "#DC2626" },
  info:    { bg: "#DBEAFE", border: "#93C5FD", icon: Info,            iconColor: "#2563EB" },
  warning: { bg: "#FEF3C7", border: "#FCD34D", icon: AlertTriangle,   iconColor: "#D97706" },
};

const ToastContext = createContext(null);

let _showToast = null;

export function MobileToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => { _showToast = show; }, [show]);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pt-safe px-4 pt-3 pointer-events-none">
        {toasts.map((toast) => {
          const style = STYLES[toast.type] || STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className="w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                animation: "slideDown 0.3s ease-out",
              }}
            >
              <Icon size={20} color={style.iconColor} className="flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-gray-800">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="flex-shrink-0">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}

export function useMobileToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useMobileToast must be used within MobileToastProvider");
  return ctx;
}

// Static helper (usable outside components)
export const mobileToast = {
  show: (msg, type) => _showToast?.(msg, type),
  success: (msg) => _showToast?.(msg, "success"),
  error:   (msg) => _showToast?.(msg, "error"),
  info:    (msg) => _showToast?.(msg, "info"),
  warning: (msg) => _showToast?.(msg, "warning"),
};