import React, { useEffect } from 'react';
import './toast.css';

interface ToastProps {
  message: string;
  position?:
    | 'top-center'
    | 'top-right'
    | 'bottom-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-left';
  duration?: number;
  onClose?: () => void;
  type: 'info' | 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  position = 'bottom-left',
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className={`toast ${position} ${type}`}>{message}</div>
    </div>
  );
};
