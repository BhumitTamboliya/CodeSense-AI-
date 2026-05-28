import React, { useState } from 'react';
import './IssueList.css';

const CONFIGS = {
  bugs: {
    icon: '🐛',
    label: 'Bugs & Errors',
    color: 'red',
    emptyMsg: 'No bugs detected — great job!',
  },
  security: {
    icon: '🔒',
    label: 'Security Issues',
    color: 'orange',
    emptyMsg: 'No security vulnerabilities found.',
  },
  improvements: {
    icon: '💡',
    label: 'Improvements',
    color: 'blue',
    emptyMsg: 'Code looks clean — no major improvements needed.',
  },
};

export default function IssueList({ type = 'bugs', items = [] }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = CONFIGS[type] || CONFIGS.bugs;

  return (
    <div className={`issue-list issue-list-${cfg.color}`}>
      <button
        className="issue-list-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span className="issue-icon">{cfg.icon}</span>
        <span className="issue-label">{cfg.label}</span>
        <span className={`issue-count ${items.length === 0 ? 'count-zero' : ''}`}>
          {items.length}
        </span>
        <span className="issue-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="issue-body">
          {items.length === 0 ? (
            <div className="issue-empty">
              <span>✓</span> {cfg.emptyMsg}
            </div>
          ) : (
            <ul className="issue-items">
              {items.map((item, i) => (
                <li key={i} className="issue-item">
                  <span className="issue-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
