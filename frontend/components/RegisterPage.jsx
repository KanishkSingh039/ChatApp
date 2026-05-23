import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { showToast } from './Toast';
import '../src/App.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--danger)' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#cc8800' };
    return { level: 3, label: 'Strong', color: 'var(--success)' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !uniqueId || !email || !password || !confirmPassword) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      await api.register(name, uniqueId, email, password);

      // Backend doesn't return a token on register,
      // so redirect to login with a success message
      showToast('Account created! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md px-8 animate-fade-in-up" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join Speakify and start messaging
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field focus-ring"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="register-uniqueId"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-disabled)',
                  fontSize: '0.875rem',
                  pointerEvents: 'none',
                }}
              >
                @
              </span>
              <input
                id="register-uniqueId"
                type="text"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value.toLowerCase().replace(/\s/g, ''))}
                placeholder="johndoe123"
                className="input-field focus-ring"
                disabled={loading}
                autoComplete="username"
                style={{ paddingLeft: '30px' }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Email
            </label>
            <input
              id="register-email"
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
              htmlFor="register-password"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="input-field focus-ring"
                disabled={loading}
                autoComplete="new-password"
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
            {/* Password strength */}
            {password && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '3px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(passwordStrength.level / 3) * 100}%`,
                      background: passwordStrength.color,
                      borderRadius: '2px',
                      transition: 'all var(--transition-normal)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: passwordStrength.color, fontWeight: '500' }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}
            >
              Confirm Password
            </label>
            <input
              id="register-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field focus-ring"
              disabled={loading}
              autoComplete="new-password"
              style={{
                borderColor: confirmPassword && confirmPassword !== password ? 'var(--danger)' : undefined,
              }}
            />
            {confirmPassword && confirmPassword !== password && (
              <p style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--danger)' }}>
                Passwords don&apos;t match
              </p>
            )}
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: '24px 0' }}>
          or
        </div>

        {/* Footer */}
        <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--text-primary)',
              fontWeight: '600',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-secondary)',
              paddingBottom: '1px',
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
