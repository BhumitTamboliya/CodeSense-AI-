import React from 'react';
import './LoadingOverlay.css';

const MESSAGES = [
  'Parsing your code...',
  'Scanning for bugs...',
  'Checking security vulnerabilities...',
  'Calculating quality score...',
  'Generating fix suggestions...',
  'Almost ready...',
];

export default function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        {/* Animated rings */}
        <div className="loading-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <span className="ring-icon">⟨/⟩</span>
        </div>

        <h3 className="loading-title">Analyzing Code</h3>
        <p className="loading-msg">{MESSAGES[msgIndex]}</p>

        {/* Progress dots */}
        <div className="loading-dots">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loading-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
