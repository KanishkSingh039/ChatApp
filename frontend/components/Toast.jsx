import React from 'react';

// Toast notification component
export const showToast = (message, type = 'info') => {
  const event = new CustomEvent('showToast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
};

export function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();

      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

      // Start exit animation after 2.5s
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
      }, 2500);

      // Remove after exit animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  if (toasts.length === 0) return null;

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          background: '#111',
          border: '1px solid rgba(0, 204, 102, 0.3)',
          color: 'var(--success)',
        };
      case 'error':
        return {
          background: '#111',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          color: 'var(--danger)',
        };
      default:
        return {
          background: '#111',
          border: '1px solid var(--border-secondary)',
          color: 'var(--text-primary)',
        };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
          style={{
            ...getToastStyle(toast.type),
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '340px',
            boxShadow: 'var(--shadow-lg)',
            pointerEvents: 'auto',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{getIcon(toast.type)}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default { showToast, ToastContainer };
