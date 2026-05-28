import React from 'react';
import './ScoreCard.css';

/**
 * Displays the code quality score with a visual ring indicator
 */
export default function ScoreCard({ score }) {
  const getColor = (s) => {
    if (s >= 80) return 'var(--green)';
    if (s >= 50) return 'var(--yellow)';
    return 'var(--red)';
  };

  const getLabel = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 50) return 'Fair';
    if (s >= 25) return 'Poor';
    return 'Critical';
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-card">
      <div className="score-ring-wrapper">
        <svg className="score-ring" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="score-center">
          <span className="score-number" style={{ color }}>{score}</span>
          <span className="score-max">/100</span>
        </div>
      </div>

      <div className="score-info">
        <span className="score-label" style={{ color }}>{getLabel(score)}</span>
        <span className="score-caption">Code Quality Score</span>
        {/* Progress bar */}
        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}
