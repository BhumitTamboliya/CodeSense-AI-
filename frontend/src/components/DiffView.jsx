import React, { useMemo } from 'react';
import './DiffView.css';

export default function DiffView({ originalCode, fixedCode, language }) {
  const diff = useMemo(() => {
    if (!originalCode || !fixedCode) return { orig: [], fixed: [] };
    const origLines = originalCode.split('\n');
    const fixedLines = fixedCode.split('\n');
    const origResult = [], fixedResult = [];
    const maxLen = Math.max(origLines.length, fixedLines.length);
    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i];
      const fixed = fixedLines[i];
      if (orig === undefined) {
        origResult.push({ type: 'empty', text: '', lineNum: '' });
        fixedResult.push({ type: 'added', text: fixed, lineNum: i + 1 });
      } else if (fixed === undefined) {
        origResult.push({ type: 'removed', text: orig, lineNum: i + 1 });
        fixedResult.push({ type: 'empty', text: '', lineNum: '' });
      } else if (orig !== fixed) {
        origResult.push({ type: 'removed', text: orig, lineNum: i + 1 });
        fixedResult.push({ type: 'added', text: fixed, lineNum: i + 1 });
      } else {
        origResult.push({ type: 'same', text: orig, lineNum: i + 1 });
        fixedResult.push({ type: 'same', text: fixed, lineNum: i + 1 });
      }
    }
    return { orig: origResult, fixed: fixedResult };
  }, [originalCode, fixedCode]);

  const stats = useMemo(() => ({
    added: diff.fixed?.filter(d => d.type === 'added').length || 0,
    removed: diff.orig?.filter(d => d.type === 'removed').length || 0,
    same: diff.orig?.filter(d => d.type === 'same').length || 0,
  }), [diff]);

  if (!originalCode || !fixedCode) return <div className="diff-empty">No code to compare.</div>;

  const renderLine = (line, i) => (
    <div key={i} className={`diff-line ${line.type === 'removed' ? 'line-removed' :
        line.type === 'added' ? 'line-added' :
          line.type === 'empty' ? 'line-empty' : ''
      }`}>
      <span className="diff-line-num">{line.lineNum}</span>
      <span className="diff-line-sign">
        {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '}
      </span>
      <span className="diff-line-code">{line.text}</span>
    </div>
  );

  return (
    <div className="diff-view">
      {/* Stats */}
      <div className="diff-stats">
        <span className="diff-lang">{language}</span>
        <div className="diff-stat-badges">
          <span className="diff-badge added">+{stats.added} added</span>
          <span className="diff-badge removed">-{stats.removed} removed</span>
          <span className="diff-badge same">{stats.same} unchanged</span>
        </div>
      </div>

      {/* Desktop: side by side | Mobile: upar neeche */}
      <div className="diff-grid">
        {/* Original Header */}
        <div className="diff-header left">
          <span className="diff-dot red" /><span className="diff-dot yellow" /><span className="diff-dot green" />
          <span className="diff-header-label">🔴 Original Code</span>
        </div>
        {/* Fixed Header */}
        <div className="diff-header right" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="diff-dot red" /><span className="diff-dot yellow" /><span className="diff-dot green" />
            <span className="diff-header-label">🟢 Fixed Code</span>
          </div>
          <button
            className="diff-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(fixedCode);
            }}
          >
            📋 Copy
          </button>
        </div>
        {/* Original Panel */}
        <div className="diff-panel left-panel">
          {diff.orig.map((line, i) => renderLine(line, i))}
        </div>
        {/* Fixed Panel */}
        <div className="diff-panel right-panel">
          {diff.fixed.map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </div>
  );
}