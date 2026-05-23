import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            padding: '24px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--danger-bg)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '1.6rem',
              }}
            >
              ⚠
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Something went wrong
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
              An unexpected error occurred
            </p>
            {this.state.error?.message && (
              <p
                style={{
                  color: 'var(--danger)',
                  fontSize: '0.8rem',
                  marginBottom: '24px',
                  padding: '12px',
                  background: 'var(--danger-bg)',
                  borderRadius: 'var(--radius-md)',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                }}
              >
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => (window.location.href = '/')}
              className="btn btn-primary"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
