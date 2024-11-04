import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { createContext, JSX, PropsWithoutRef, ReactNode, useContext, useState } from "react";
import Portal from "~/components/Portal";
import styles from "./Toast.module.css";
import { AnimatePresence, motion } from "framer-motion";

type ToastVariant = "error" | "info" | "success";

type Toast = {
  id: string;
  message: string;
  removeIn?: number;
  variant?: ToastVariant;
}

type ToastContextType = {
  removeToast: (id: Toast["id"]) => void;
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({
  removeToast: () => {},
  showToast: () => {},
});

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<Toast>>([]);

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 9);
  }

  function showToast(toast: Omit<Toast, "id">) {
    const id = generateRandomId();

    setToasts((prev) => [...prev, {
      ...toast,
      id,
    }]);

    setTimeout(() => {
      removeToast(id);
    }, toast?.removeIn || 5000);
  }

  function removeToast(id: Toast["id"]) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ removeToast, showToast }}>
      {children}

      <ToastContainer onRemove={removeToast} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

type ToastContainerProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  onRemove: (toastId: Toast["id"]) => void;
  toasts: Array<Toast>;
}>

function ToastContainer({ className, onRemove, toasts = [], ...props }: ToastContainerProps) {
  return (
    <Portal>
      <div {...props} className={clsx(styles.toastContainer, className)}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.message}>
              <Toast onRemove={() => onRemove(toast.id)} toast={toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </Portal>
  );
}

type ToastProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  onRemove: () => void;
  toast: Toast;
}>

function Toast({ className, onRemove, toast: { message, variant = "info" }, ...props }: ToastProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, y: 50 }}
      layout
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div {...props} className={clsx(styles.toast, styles[`toast-${variant}`], className)}>
        <div className={styles.body}>
          {message}

          <button aria-label="Close" className={styles.closeButton} onClick={onRemove}>
            <IconX size="1rem" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
