import { createContext, useContext, useState, useCallback } from "react";
const ToastContext = createContext();
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, tipo = "success") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, tipo }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  const toast = { success: msg => addToast(msg, "success"), error: msg => addToast(msg, "error") };
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.tipo}`}>
            <span>{t.tipo === "success" ? "✅" : "❌"}</span>
            <span className="toast-msg">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
