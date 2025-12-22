// src/pages/ForgotPassword.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import alumniBg from '../assests/alumnis.jpg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900/30 relative"
      style={{
        backgroundImage: `url(${alumniBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div
          className={`rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-xl transition-all duration-500
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-white">
                  Forgot your password?
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Enter your email and we’ll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/90 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-white/20 bg-white/85 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </button>

                <div className="text-center text-sm text-white/90">
                  <Link to="/login" className="underline">
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-2xl">
                ✓
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Check your email
              </h3>
              <p className="text-white/80 mb-6">
                If an account exists for <strong>{email}</strong>, you’ll receive
                a password reset link shortly.
              </p>

              <Link
                to="/login"
                className="inline-block rounded-md px-6 py-2 bg-white/90 text-gray-900 font-medium hover:bg-white transition"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-white/70">
          Having trouble? Contact support.
        </div>
      </div>
    </div>
  );
}
