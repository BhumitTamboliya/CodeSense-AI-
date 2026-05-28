import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ReviewPage from './pages/ReviewPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import SharedReviewPage from './pages/SharedReviewPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import { ToastContext } from './services/ToastContext';
import { AuthProvider, useAuth } from './services/AuthContext';
import './styles/globals.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppInner() {
  const [theme, setTheme] = useState(() => localStorage.getItem('codesense-theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('codesense-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  };

  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="app-shell">
        {/* Global Backdrop Grid & Animated Glow Orbs */}
        <div className="app-grid-bg" />
        <div className="app-overlay" />
        <div className="app-orb app-orb-1" />
        <div className="app-orb app-orb-2" />
        <div className="app-orb app-orb-3" />

        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/"      element={<LandingPage />} />
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/share/:shareId" element={<SharedReviewPage />} />
            <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <div className="toast-container" aria-live="polite">
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}