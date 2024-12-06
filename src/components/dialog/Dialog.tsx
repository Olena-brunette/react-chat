import React, { PropsWithChildren } from 'react';
import './dialog.css';
import { Toast } from '../toast/Toast';

interface DialogProps {
  submitText: string;
  cancelText: string;
  onActionSubmit: () => void;
  onActionCancel: () => void;
  type: 'form' | 'warning';
  error?: string;
  loading?: boolean;
  setError?: (error: string) => void;
}

const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  onActionSubmit,
  onActionCancel,
  submitText,
  cancelText,
  type,
  children,
  loading,
  error,
  setError,
}) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === 'dialog-overlay') {
      onActionCancel();
    }
  };

  const closeError = () => {
    setError && setError('');
  };
  return (
    <div
      id="dialog-overlay"
      className="dialog-overlay"
      onClick={handleOverlayClick}
    >
      <div className={`${loading ? 'loader' : ''}`}></div>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-content">{children}</div>
        <div className="dialog-actions">
          <button className={`dialog-button ${type}`} onClick={onActionCancel}>
            {cancelText}
          </button>
          <button className={`dialog-button ${type}`} onClick={onActionSubmit}>
            {submitText}
          </button>
        </div>
      </div>
      {error && <Toast message={error} type="error" onClose={closeError} />}
    </div>
  );
};

export default Dialog;
