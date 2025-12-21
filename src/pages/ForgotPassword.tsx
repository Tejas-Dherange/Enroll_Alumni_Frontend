import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page-root">
        <div className="wrapper" role="status" aria-live="polite">
          <div className="title-text" aria-hidden>
            <div className="title login">Reset Link Sent</div>
            <div className="title signup">Check Your Email</div>
          </div>

          <div className="form-container">
            <div className="form-inner" style={{ transform: 'translateX(0%)' }}>
              <div className="form-panel">
                <div className="success-block" style={{ padding: 20, textAlign: 'center' }}>
                  <div className="success-icon" style={{ background: '#fff0f6', color: '#9b2c6b' }}>
                    {/* stylized envelope icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16v16H4z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </div>

                  <h2 className="text-2xl" style={{ marginTop: 12, marginBottom: 6, color: '#111', fontWeight: 700 }}>
                    Check your email
                  </h2>
                  <p style={{ color: '#555', marginBottom: 18 }}>
                    If an account exists with this email, you'll receive password reset instructions.
                  </p>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Link to="/login" className="submit-btn" style={{ width: 160, height: 40, textAlign: 'center', lineHeight: '40px', padding: 0 }}>
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>

              {/* second panel blank to preserve layout symmetry */}
              <div className="form-panel" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-root">
      <div className="wrapper" role="form" aria-labelledby="forgot-title">
        <div className="title-text" aria-hidden>
          <div className="title login">Forgot Password</div>
          <div className="title signup">Reset Link</div>
        </div>

        <div className="form-container">
          <div className="form-inner" style={{ transform: 'translateX(0%)' }}>
            <div className="form-panel">
              <form className="auth-form" onSubmit={handleSubmit} aria-label="Forgot password form" style={{ animation: 'fadeInUp .45s ease both' }}>
                <h3 id="forgot-title" style={{ textAlign: 'center', marginBottom: 6, fontSize: 20, fontWeight: 700 }}>Reset your password</h3>
                <p style={{ textAlign: 'center', marginBottom: 16, color: '#666' }}>Enter your email address and we'll send you a reset link</p>

                {error && (
                  <div className="alert error" role="alert" style={{ marginBottom: 12 }}>
                    {error}
                  </div>
                )}

                <div className="field">
                  <label htmlFor="email" className="label">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="btn" style={{ marginTop: 18 }}>
                  <button type="submit" disabled={loading} className="submit-btn" style={{ width: '100%' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>

                <div className="text-center" style={{ marginTop: 12 }}>
                  <Link to="/login" className="link">Back to Login</Link>
                </div>
              </form>
            </div>

            {/* empty second panel to keep symmetric layout like other auth pages */}
            <div className="form-panel" />
          </div>
        </div>
      </div>
    </div>
  );
}
