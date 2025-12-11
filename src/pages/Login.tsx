import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);

      if (data.user.status?.toUpperCase() === 'BLOCKED') {
        setError('Your account has been blocked. Please contact the administrator for assistance.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);

      switch (data.user.role?.toUpperCase()) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'MENTOR':
          navigate('/mentor');
          break;
        case 'STUDENT':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} aria-label="Login form">
      {error && <div className="alert error">{error}</div>}

      <div className="field">
        <label htmlFor="loginEmail" className="label">Email address</label>
        <input
          id="loginEmail"
          name="email"
          type="email"
          required
          className="input"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="loginPassword" className="label">Password</label>
        <input
          id="loginPassword"
          name="password"
          type="password"
          required
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="pass-link">
        <Link to="/forgot-password" className="link">Forgot your password?</Link>
      </div>

      <div className="field btn">
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="signup-link">
        <Link to="/signup" className="link">Don't have an account? Sign up</Link>
      </div>
    </form>
  );
}
