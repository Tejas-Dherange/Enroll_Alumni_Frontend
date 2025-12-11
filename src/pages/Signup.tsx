import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  college: string;
  city: string;
  batchYear: number;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    college: '',
    city: '',
    batchYear: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.signup(formData);
      setSuccess(true);
      // optionally navigate or show verification UI
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-block" role="status">
        <div className="success-icon">✓</div>
        <h3>Registration successful</h3>
        <p>Please check your email to verify your account.</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} aria-label="Signup form">
      {error && <div className="alert error">{error}</div>}

      <div className="grid-2">
        <div className="field">
          <label className="label" htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" required className="input" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label" htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" required className="input" value={formData.lastName} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="input" value={formData.email} onChange={handleChange} />
      </div>

      <div className="field">
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={8} className="input" value={formData.password} onChange={handleChange} />
      </div>

      <div className="field">
        <label className="label" htmlFor="college">College</label>
        <input id="college" name="college" required className="input" value={formData.college} onChange={handleChange} />
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="label" htmlFor="city">City</label>
          <input id="city" name="city" required className="input" value={formData.city} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label" htmlFor="batchYear">Batch Year</label>
          <input id="batchYear" name="batchYear" type="number" required className="input" value={formData.batchYear} onChange={handleChange} />
        </div>
      </div>

      <div className="field btn">
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </div>
    </form>
  );
}
