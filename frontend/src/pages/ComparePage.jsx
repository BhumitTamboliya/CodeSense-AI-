import React, { useState } from 'react';
import { comparePasted, compareFiles } from '../services/api';
import { useToast } from '../services/ToastContext';
import LoadingOverlay from '../components/LoadingOverlay';
import FileUpload from '../components/FileUpload';
import ScoreCard from '../components/ScoreCard';
import IssueList from '../components/IssueList';
import './ComparePage.css';

export default function ComparePage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [mode, setMode]   = useState('paste'); // 'paste' | 'file'
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [name1, setName1] = useState('Version 1');
  const [name2, setName2] = useState('Version 2');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const { addToast } = useToast();

  // ── Compare handler ───────────────────────────────────────────────────
  const handleCompare = async () => {
    setError(null);
    setResult(null);

    if (mode === 'paste' && (!code1.trim() || !code2.trim())) {
      setError('Please provide both code snippets to compare.');
      return;
    }
    if (mode === 'file' && (!file1 || !file2)) {
      setError('Please upload both files to compare.');
      return;
    }

    setLoading(true);
    try {
      const data = mode === 'file'
        ? await compareFiles(file1, file2)
        : await comparePasted(code1, code2, name1, name2);
      setResult(data);
    } catch (err) {
      const msg = err.message || 'Comparison failed. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode1(''); setCode2('');
    setFile1(null); setFile2(null);
    setResult(null); setError(null);
  };

  // ── Winner info ───────────────────────────────────────────────────────
  const winner = result?.comparison?.winner;
  const winnerName = winner === 'file1' ? (name1 || 'File 1')
    : winner === 'file2' ? (name2 || 'File 2')
    : 'Tie';

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="compare-page">
      {loading && <LoadingOverlay />}

      <div className="page-container">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-icon">↔</span> Compare Code
            </h1>
            <p className="page-subtitle">
              Compare two code snippets or files side-by-side with AI analysis.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="card input-card">

          {/* Mode tabs */}
          <div className="input-mode-tabs">
            <button
              className={`mode-tab ${mode === 'paste' ? 'active' : ''}`}
              onClick={() => { setMode('paste'); setFile1(null); setFile2(null); }}
            >
              📋 Paste Code
            </button>
            <button
              className={`mode-tab ${mode === 'file' ? 'active' : ''}`}
              onClick={() => { setMode('file'); setCode1(''); setCode2(''); }}
            >
              📁 Upload Files
            </button>
          </div>

          {/* Two-panel input */}
          <div className="compare-input-grid">

            {/* Panel 1 */}
            <div className="compare-panel">
              <div className="panel-header">
                {mode === 'paste' ? (
                  <input
                    className="panel-name-input"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Label (e.g. v1.js)"
                  />
                ) : (
                  <span className="panel-label">File 1</span>
                )}
              </div>
              {mode === 'paste' ? (
                <textarea
                  className="code-textarea compare-textarea"
                  value={code1}
                  onChange={(e) => setCode1(e.target.value)}
                  placeholder="// Paste your first code snippet here..."
                  spellCheck={false}
                  autoCapitalize="off"
                />
              ) : (
                <FileUpload onFileSelect={setFile1} label="Upload first file" />
              )}
            </div>

            {/* VS divider */}
            <div className="compare-vs">
              <span>VS</span>
            </div>

            {/* Panel 2 */}
            <div className="compare-panel">
              <div className="panel-header">
                {mode === 'paste' ? (
                  <input
                    className="panel-name-input"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Label (e.g. v2.js)"
                  />
                ) : (
                  <span className="panel-label">File 2</span>
                )}
              </div>
              {mode === 'paste' ? (
                <textarea
                  className="code-textarea compare-textarea"
                  value={code2}
                  onChange={(e) => setCode2(e.target.value)}
                  placeholder="// Paste your second code snippet here..."
                  spellCheck={false}
                  autoCapitalize="off"
                />
              ) : (
                <FileUpload onFileSelect={setFile2} label="Upload second file" />
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner" style={{ margin: '0 20px 4px' }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Actions */}
          <div className="input-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>
              Clear
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCompare}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Comparing...</>
                : <>↔ Compare Files</>
              }
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {result && (
          <div className="compare-results fade-in">

            {/* Winner banner */}
            {result.comparison && (
              <div className={`winner-banner ${winner === 'tie' ? 'winner-tie' : 'winner-has'}`}>
                <span className="winner-trophy">{winner === 'tie' ? '🤝' : '🏆'}</span>
                <div className="winner-info">
                  <div className="winner-title">
                    {winner === 'tie' ? "It's a Tie!" : `Winner: ${winnerName}`}
                  </div>
                  {result.comparison.recommendation && (
                    <div className="winner-rec">{result.comparison.recommendation}</div>
                  )}
                </div>
              </div>
            )}

            {/* Side-by-side score cards */}
            <div className="compare-score-grid">
              {[result.file1, result.file2].map((f, i) => f && (
                <div
                  key={i}
                  className={`compare-score-card card ${
                    winner === (i === 0 ? 'file1' : 'file2') ? 'card-winner' : ''
                  }`}
                >
                  {winner === (i === 0 ? 'file1' : 'file2') && (
                    <div className="winner-ribbon">🏆 Winner</div>
                  )}
                  <div className="cs-header">
                    <h3 className="cs-name">{f.name}</h3>
                    <span className="badge badge-blue">{f.language}</span>
                  </div>
                  <ScoreCard score={f.qualityScore} />
                  {f.summary && (
                    <p className="cs-summary">{f.summary}</p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <IssueList type="bugs"     items={f.bugs || []} />
                    <IssueList type="security" items={f.securityIssues || []} />
                  </div>
                </div>
              ))}
            </div>

            {/* Key differences */}
            {result.comparison?.differences?.length > 0 && (
              <div className="card differences-card">
                <div className="section-label mb-12">
                  <span className="dot" style={{ background: 'var(--accent-blue)' }} />
                  Key Differences
                </div>
                <ul className="differences-list">
                  {result.comparison.differences.map((d, i) => (
                    <li key={i} className="difference-item">
                      <span className="diff-arrow">→</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
