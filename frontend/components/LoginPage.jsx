import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/context';
import { api } from '../utils/api';
import { STORAGE_KEYS } from '../utils/config';
import '../src/App.css';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      const response = await api.login(email, password);

      if (!response.token) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      const token =localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      // Decode JWT to get name (payload is base64 in part[1])
      let userName = email.split('@')[0];
      try {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        if (payload.name) {
          userName = payload.name;
        }
      } catch (e) {
        console.warn('Could not decode JWT:', e);
      }

      // Login with name — context will resolve _id via socket
      await auth.login(response.token, {
        email,
        name: userName,
      });
      if (token) {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md px-8 animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to continue to ChatApp
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div
              className="animate-fade-in-down"
              style={{
                padding: '12px 16px',
                background: 'var(--danger-bg)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field focus-ring"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field focus-ring"
                disabled={loading}
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '0.8rem',
                }}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: '28px 0' }}>
          or
        </div>

        {/* Footer */}
        <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: 'var(--text-primary)',
              fontWeight: '600',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-secondary)',
              paddingBottom: '1px',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
