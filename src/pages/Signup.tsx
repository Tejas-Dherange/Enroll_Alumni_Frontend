// src/pages/Signup.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
// adjust path if your folder is 'assets' not 'assests'
import alumniBg from '../assests/alumnis.jpg';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    college: '',
    city: '',
    batchYear: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // for entrance animation
  const navigate = useNavigate();

  useEffect(() => {
    // trigger entrance animation after mount
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'batchYear') {
      // keep batchYear as number
      setFormData((p) => ({ ...p, [name]: Number(value) }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.signup(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-900/30 relative px-4 py-12"
        style={{
          backgroundImage: `url(${alumniBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div
          className={`relative z-10 w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-xl transform transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Registration successful!</h2>
            <p className="text-sm text-white/85 mt-2">Your email will be verified by admin within 24 hours, if any problem contact admin (support@enrollengineer.in)</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-md shadow-md hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Go to Login
            </button>
            {/* <button
              onClick={() => setSuccess(false)}
              className="flex-1 py-2.5 rounded-md border border-white/20 text-white bg-white/5 hover:bg-white/10 transition"
            >
              Register another
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900/30 relative"
      style={{
        backgroundImage: `url(${alumniBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      role="main"
      aria-label="Sign up page"
    >
      {/* overlay so background doesn't clash */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* responsive container: on lg show split layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="bg-transparent rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* LEFT: visual / intro (only on large screens; still visible underneath for small screens) */}
          <div
            className={`hidden lg:flex flex-col justify-center px-10 py-12 bg-gradient-to-br from-indigo-700/30 to-purple-700/20
            border border-white/5 rounded-2xl shadow-inner`}
            aria-hidden="true"
          >
            <div className="text-white/95 mb-6">
              <h2 className="text-4xl font-extrabold leading-tight mb-2">Join the alumni network</h2>
              <p className="text-lg text-white/80">Connect with peers, mentors and opportunities — register to get started.</p>
            </div>

            <div className="mt-6">
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
            </div>

            <div className="mt-8 text-sm text-white/70">
              <p>Have an account already? <Link to="/login" className="underline text-white">Sign in</Link></p>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div
            className={`mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-xl transform transition-all duration-500
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
              <p className="text-sm text-white/80 mt-1">Student registration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/90 mb-1">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/90 mb-1">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  placeholder="your@gmail.com"
                  type="email"
                  required
                  className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-white/90 mb-1">Mobile number</label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="10-digit mobile number"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  placeholder='Enter your password'
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-medium text-white/90 mb-1">College</label>
                <input
                  id="college"
                  name="college"
                  placeholder="College name"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-white/90 mb-1">City</label>
                  <input
                    id="city"
                    name="city"
                    placeholder="City name"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="batchYear" className="block text-sm font-medium text-white/90 mb-1">Batch year</label>
                  <input
                    id="batchYear"
                    name="batchYear"
                    type="number"
                    required
                    min={1900}
                    max={2100}
                    className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={String(formData.batchYear)}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-md py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </div>

              <div className="text-center text-sm text-white/85">
                <span>Already have an account? </span>
                <Link to="/login" className="underline text-white">Sign in</Link>
              </div>
            </form>
          </div>
        </div>

        {/* small footer / terms */}
        <div className="mt-6 text-center text-xs text-white/70">
          By creating an account you agree to our <Link to="/terms" className="underline">terms</Link>.
        </div>
      </div>
    </div>
  );
}
