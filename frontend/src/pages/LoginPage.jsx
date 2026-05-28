import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useToast } from '../services/ToastContext';
import { loginUser } from '../services/api';
import './AuthPage.css';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { addToast }    = useToast();
  const navigate        = useNavigate();

  useEffect(() => { if (user) navigate('/review'); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim())    errs.email    = 'Email is required.';
    if (!form.password)        errs.password = 'Password is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const data = await loginUser(form.email.trim(), form.password);
      login(data.user, data.token);
      addToast(`Welcome back, ${data.user.name}! 👋`, 'success');
      navigate('/review');
    } catch (err) {
      setErrors({ general: err.message || 'Login failed. Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const change = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(ev => ({ ...ev, [field]: '', general: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <span className="auth-logo-icon">⟨/⟩</span>
          <span className="auth-logo-text">CodeSense <span>AI</span></span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {errors.general && (
          <div className="auth-error-banner">{errors.general}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">@</span>
              <input className="auth-input" type="email"
                value={form.email} onChange={change('email')}
                placeholder="you@example.com" autoFocus autoComplete="email" />
            </div>
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔑</span>
              <input className="auth-input" type="password"
                value={form.password} onChange={change('password')}
                placeholder="Enter your password" autoComplete="current-password" />
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          <button className="auth-submit btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign in →'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-demo-btn" onClick={() => {
          login({ email: 'demo@codesense.ai', name: 'Demo User' }, null);
          addToast('Logged in as Demo User', 'success');
          navigate('/review');
        }}>
          <span>⚡</span> Try Demo Account
        </button>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
