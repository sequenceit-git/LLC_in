import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setBusy(true);
    try {
      await login(username.trim(), password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/logo.png" alt="LLC Publication Online" className="admin-login-logo" />
          <h2 className="admin-login-title">Admin Console</h2>
          <p className="admin-login-desc">Sign in to manage county tariffs, orders, and publications.</p>
        </div>

        {error && (
          <div className="admin-login-alert" role="alert">
            <span className="admin-login-alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <label className="admin-login-field">
            <span>Username</span>
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={busy}
            />
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={busy}
            />
          </label>

          <button type="submit" className="btn btn-gold admin-login-btn" disabled={busy}>
            {busy ? 'Authenticating…' : 'Sign In to Console →'}
          </button>
        </form>

        <div className="admin-login-foot">
          <a href="/" className="admin-login-back">← Return to Public Website</a>
          <span className="admin-login-badge">Protected by bcrypt &amp; JWT</span>
        </div>
      </div>
    </div>
  );
}
