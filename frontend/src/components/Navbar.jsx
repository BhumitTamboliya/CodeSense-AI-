import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Navbar.css';

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo - left */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-bracket">⟨/⟩</span>
          <span className="logo-text">CodeSense <span className="logo-ai">AI</span></span>
        </NavLink>

        {/* Desktop nav links */}
        {user && (
          <div className="navbar-links">
            <NavLink to="/review"  className={({isActive}) => `nav-link${isActive?' active':''}`}>Review</NavLink>
            <NavLink to="/compare" className={({isActive}) => `nav-link${isActive?' active':''}`}>Compare</NavLink>
            <NavLink to="/history" className={({isActive}) => `nav-link${isActive?' active':''}`}>History</NavLink>
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {user ? (
            <>
              <div className="user-avatar" title={user.name || user.email}>{initials}</div>
              <span className="user-name">{user.name || user.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">Sign In</NavLink>
          )}

          {/* Hamburger - mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && user && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <NavLink to="/review"  className="mobile-link">Review</NavLink>
          <NavLink to="/compare" className="mobile-link">Compare</NavLink>
          <NavLink to="/history" className="mobile-link">History</NavLink>
          <button className="mobile-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}