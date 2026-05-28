import React, { useEffect, useState } from 'react';
import './Toast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export default function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-enter' : 'toast-exit'}`}>
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={handleClose} aria-label="Dismiss">✕</button>
    </div>
  );
}
