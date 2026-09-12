import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/context';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import LandingPage from '../components/LandingPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/MainLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastContainer } from '../components/Toast';
import './App.css';

function App() {
  const auth = useContext(AuthContext);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-primary)' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/home/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />

          {/* Root - Landing page */}
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100vh',
                  background: 'var(--bg-primary)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <h1
                    style={{
                      fontSize: '4rem',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    404
                  </h1>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
                    Page not found
                  </p>
                  <a
                    href="/"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;