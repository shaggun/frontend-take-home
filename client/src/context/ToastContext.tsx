import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Text, Flex } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';
import styles from '../styles/Toast.module.css';

type ToastType = 'success' | 'error';

interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, title?: string) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Provider component for the toast notification system
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [open, setOpen] = useState(false);

  const showToast = (type: ToastType, message: string, title?: string) => {
    // Generate unique ID for the toast
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Add new toast to the list
    setToasts((prevToasts) => [...prevToasts, { id, type, message, title }]);
    setOpen(true);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    if (toasts.length <= 1) {
      setOpen(false);
    }
  };

  // Get the most recent toast
  const activeToast = toasts[0];

  // Style mappings for toast types
  const toastTypeClassMap: Record<ToastType, string> = {
    success: styles.toastSuccess,
    error: styles.toastError
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      <Toast.Provider>
        {activeToast && (
          <Toast.Root
            open={open}
            onOpenChange={setOpen}
            className={`${styles.toastRoot} ${toastTypeClassMap[activeToast.type]}`}
          >
            <Flex direction="column" gap="1">
              {activeToast.title && (
                <Toast.Title asChild>
                  <Text className={styles.toastTitle}>{activeToast.title}</Text>
                </Toast.Title>
              )}
              <Toast.Description asChild>
                <Text className={styles.toastDescription}>{activeToast.message}</Text>
              </Toast.Description>
            </Flex>
            <button
              onClick={() => hideToast(activeToast.id)}
              aria-label="Close"
              className={styles.toastClose}
            >
              <Cross1Icon />
            </button>
          </Toast.Root>
        )}
        <Toast.Viewport className={styles.toastViewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

/**
 * Hook for using the toast context
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
