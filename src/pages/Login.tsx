// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
// adjust path if your folder is 'assets' not 'assests'
import alumniBg from '../assests/alumnis.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // for entrance animation
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);

      // Check if user is blocked
      if (data.user.status?.toUpperCase() === 'BLOCKED') {
        setError('Your account has been blocked. Please contact the administrator for assistance.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);

      // Redirect based on role
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
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900/30 relative"
      role="main"
      aria-label="Sign in page"
      style={{
        backgroundImage: `url(${alumniBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay so background doesn't clash with text */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left panel (visual + copy) - visible on large screens */}
          <div
            className="hidden lg:flex flex-col justify-center px-10 py-12 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-700/25 to-purple-700/15 shadow-inner"
            aria-hidden="true"
          >
            <h2 className="text-4xl font-extrabold text-white/95 mb-3">Welcome back</h2>
            <p className="text-lg text-white/85 mb-6">Sign in to access the alumni portal — connect with peers, mentors, and opportunities.</p>

            <ul className="space-y-3 text-white/85">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10">✓</span>
                <span>Verified student accounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10">✓</span>
                <span>Mentorship & networking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10">✓</span>
                <span>Portal announcements & events</span>
              </li>
            </ul>

            <div className="mt-8 text-sm text-white/70">
              <p>
                New here? <Link to="/signup" className="underline text-white">Create an account</Link>
              </p>
            </div>
          </div>

          {/* Right panel: glass card with form */}
          <div
            className={`mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-xl transform transition-all duration-500
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-white">Sign in to your account</h2>
              <p className="text-sm text-white/80 mt-1">Welcome back — please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-white/20 bg-white/85 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-white/20 bg-white/85 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-white/85 hover:text-white underline">
                  Forgot your password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-md py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="text-center text-sm text-white/90">
                <span>Don't have an account? </span>
                <Link to="/signup" className="text-white/95 font-medium underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* small footer / terms */}
        <div className="mt-6 text-center text-xs text-white/70">
          By signing in you agree to our <Link to="/terms" className="underline">terms</Link>.
        </div>
      </div>
    </div>
  );
}
