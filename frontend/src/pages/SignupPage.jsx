import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useToast } from '../services/ToastContext';
import { sendOTP, verifyOTP, registerUser } from '../services/api';
import './AuthPage.css';

export default function SignupPage() {
  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [name, setName]         = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [timer, setTimer]       = useState(0);

  const { login, user } = useAuth();
  const { addToast }    = useToast();
  const navigate        = useNavigate();

  useEffect(() => { if (user) navigate('/review'); }, [user, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // Step 1 — Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address.' }); return;
    }
    setLoading(true); setErrors({});
    try {
      await sendOTP(email.trim());
      addToast('OTP sent! Check your email 📧', 'success');
      setStep(2); setTimer(60);
    } catch (err) {
      addToast(err.message || 'Failed to send OTP.', 'error');
    } finally { setLoading(false); }
  };

  // Step 2 — Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP.' }); return;
    }
    setLoading(true); setErrors({});
    try {
      await verifyOTP(email.trim(), otp.trim());
      addToast('Email verified! ✅', 'success');
      setStep(3);
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid OTP.' });
    } finally { setLoading(false); }
  };

  // Step 3 — Create Account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim())             errs.name     = 'Name is required.';
    if (!password)                errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'At least 6 characters.';
    if (password !== confirm)     errs.confirm  = 'Passwords do not match.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({});
    try {
      const data = await registerUser(name.trim(), email.trim(), password);
      login(data.user, data.token);
      addToast('Account created! Welcome to CodeSense AI 🎉', 'success');
      navigate('/review');
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Try again.' });
    } finally { setLoading(false); }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await sendOTP(email.trim());
      addToast('New OTP sent! 📧', 'success');
      setTimer(60); setOtp('');
    } catch { addToast('Failed to resend OTP.', 'error'); }
    finally { setLoading(false); }
  };

  // Password strength
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)           s++;
    if (password.length >= 10)          s++;
    if (/[A-Z]/.test(password))         s++;
    if (/[0-9]/.test(password))         s++;
    if (/[^A-Za-z0-9]/.test(password))  s++;
    return Math.min(s, 4);
  })();
  const strengthLabel = ['','Weak','Fair','Good','Strong'][strength];
  const strengthColor = ['','var(--red)','var(--yellow)','var(--accent)','var(--green)'][strength];

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <span className="auth-logo-icon">⟨/⟩</span>
          <span className="auth-logo-text">CodeSense <span>AI</span></span>
        </div>

        {/* Step Indicator */}
        <div className="auth-steps">
          {['Email', 'Verify OTP', 'Details'].map((s, i) => (
            <div key={i} className={`auth-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
              <div className="auth-step-dot">{step > i+1 ? '✓' : i+1}</div>
              <span className="auth-step-label">{s}</span>
            </div>
          ))}
        </div>

        {/* General error */}
        {errors.general && <div className="auth-error-banner">{errors.general}</div>}

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Create account</h1>
              <p className="auth-subtitle">Enter your email to get started</p>
            </div>
            <form className="auth-form" onSubmit={handleSendOTP} noValidate>
              <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">@</span>
                  <input className="auth-input" type="email"
                    value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }}
                    placeholder="you@example.com" autoFocus autoComplete="email" />
                </div>
                {errors.email && <span className="auth-error">{errors.email}</span>}
              </div>
              <button className="auth-submit btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending OTP...</> : 'Send OTP →'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">
                6-digit code sent to <strong style={{color:'var(--accent)'}}>{email}</strong>
              </p>
            </div>
            <form className="auth-form" onSubmit={handleVerifyOTP} noValidate>
              <div className={`auth-field ${errors.otp ? 'has-error' : ''}`}>
                <label className="auth-label">Enter OTP</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input className="auth-input otp-input" type="text"
                    value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g,'')); setErrors({}); }}
                    placeholder="000000" maxLength={6} autoFocus />
                </div>
                {errors.otp && <span className="auth-error">{errors.otp}</span>}
              </div>
              <button className="auth-submit btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Verifying...</> : 'Verify OTP →'}
              </button>
            </form>
            <div className="auth-resend">
              {timer > 0
                ? <p>Resend in <strong style={{color:'var(--accent)'}}>{timer}s</strong></p>
                : <button className="auth-resend-btn" onClick={handleResend} disabled={loading}>Resend OTP</button>
              }
            </div>
            <button className="auth-back-btn" onClick={() => setStep(1)}>← Change email</button>
          </>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Almost there!</h1>
              <p className="auth-subtitle">Set your name and password</p>
            </div>
            <form className="auth-form" onSubmit={handleCreateAccount} noValidate>
              <div className={`auth-field ${errors.name ? 'has-error' : ''}`}>
                <label className="auth-label">Full name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input className="auth-input" type="text"
                    value={name} onChange={e => { setName(e.target.value); setErrors({}); }}
                    placeholder="Your name" autoFocus autoComplete="name" />
                </div>
                {errors.name && <span className="auth-error">{errors.name}</span>}
              </div>

              <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className="auth-input" type="password"
                    value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }}
                    placeholder="Min 6 characters" autoComplete="new-password" />
                </div>
                {password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-bar"
                          style={{background: i <= strength ? strengthColor : 'var(--border-bright)'}} />
                      ))}
                    </div>
                    <span className="strength-label" style={{color: strengthColor}}>{strengthLabel}</span>
                  </div>
                )}
                {errors.password && <span className="auth-error">{errors.password}</span>}
              </div>

              <div className={`auth-field ${errors.confirm ? 'has-error' : ''}`}>
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✓</span>
                  <input className="auth-input" type="password"
                    value={confirm} onChange={e => { setConfirm(e.target.value); setErrors({}); }}
                    placeholder="Re-enter password" autoComplete="new-password" />
                </div>
                {errors.confirm && <span className="auth-error">{errors.confirm}</span>}
              </div>

              <button className="auth-submit btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating account...</> : '🚀 Create Account'}
              </button>
            </form>
          </>
        )}

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
