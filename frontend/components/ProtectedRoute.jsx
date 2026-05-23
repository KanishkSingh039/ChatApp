import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/context';

export function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext);

  if (auth.loading) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          gap: '16px',
        }}
      >
        <div className="spinner-lg spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
