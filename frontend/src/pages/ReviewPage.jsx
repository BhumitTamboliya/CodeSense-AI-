import React, { useState, useRef } from 'react';
import { reviewCode, reviewFile, generateShareLink } from '../services/api';
import { useToast } from '../services/ToastContext';
import LoadingOverlay from '../components/LoadingOverlay';
import ScoreCard from '../components/ScoreCard';
import IssueList from '../components/IssueList';
import FileUpload from '../components/FileUpload';
import './ReviewPage.css';
import DiffView from '../components/DiffView';
import CodeBlock from '../components/CodeBlock';

const PLACEHOLDER = `// Paste your code here and click "Analyze Code"
// Example — try finding the bug below:

function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i <= items.length; i++) {  // bug: <= should be <
    total += items[i].price;
  }
  return total;
}

const password = "admin123";  // security issue: hardcoded password
console.log(calculateTotal([{price: 10}, {price: 20}]));`;

export default function ReviewPage() {
  // ── State ───────────────────────────────────────────────────────────────
  const [code, setCode] = useState('');
  const [file, setFile] = useState(null);
  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'file'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [shareUrl, setShareUrl] = useState(null);
  const [sharing, setSharing] = useState(false);

  const { addToast } = useToast();
  const resultRef = useRef(null);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setShareUrl(null);

    if (inputMode === 'paste' && !code.trim()) {
      setError('Please paste some code to review.');
      return;
    }
    if (inputMode === 'file' && !file) {
      setError('Please upload a file to review.');
      return;
    }

    setLoading(true);
    try {
      const data = inputMode === 'file'
        ? await reviewFile(file)
        : await reviewCode(code);

      setResult(data);
      setActiveTab('overview');

      // Scroll smoothly to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const msg = err.message || 'Something went wrong. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result?.reviewId) {
      addToast('Share links require MongoDB to be connected.', 'warning');
      return;
    }
    setSharing(true);
    try {
      const data = await generateShareLink(result.reviewId);
      setShareUrl(data.shareUrl);
      await navigator.clipboard.writeText(data.shareUrl);
      addToast('Share link copied to clipboard!', 'success');
    } catch (err) {
      addToast('Could not generate share link — is MongoDB connected?', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setFile(null);
    setResult(null);
    setError(null);
    setShareUrl(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="review-page">
      {loading && <LoadingOverlay />}

      <div className="page-container">

        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-icon">⟨/⟩</span> Code Review
            </h1>
            <p className="page-subtitle">
              Paste or upload your code — AI will detect bugs, security issues, and suggest instant fixes.
            </p>
          </div>
        </div>

        {/* ── Input Card ── */}
        <div className="card input-card">

          {/* Mode selector tabs */}
          <div className="input-mode-tabs">
            <button
              className={`mode-tab ${inputMode === 'paste' ? 'active' : ''}`}
              onClick={() => { setInputMode('paste'); setFile(null); }}
            >
              📋 Paste Code
            </button>
            <button
              className={`mode-tab ${inputMode === 'file' ? 'active' : ''}`}
              onClick={() => { setInputMode('file'); setCode(''); }}
            >
              📁 Upload File
            </button>
          </div>

          {/* Code input area */}
          {inputMode === 'paste' ? (
            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
          ) : (
            <div className="file-upload-area">
              <FileUpload
                onFileSelect={setFile}
                label="Upload your code file"
              />
              {file && (
                <p className="file-info">
                  <span className="text-green">✓</span>{' '}
                  <strong>{file.name}</strong> — {(file.size / 1024).toFixed(1)} KB ready to review
                </p>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-banner">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="input-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>
              Clear
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Analyzing...</>
                : <>⚡ Analyze Code</>
              }
            </button>
          </div>
        </div>

        {/* ── Results Section ── */}
        {result && (
          <div className="results-section fade-in" ref={resultRef}>

            {/* Results top bar */}
            <div className="results-header">
              <div className="results-meta">
                <span className="badge badge-blue">{result.language}</span>
                {result.fileName && (
                  <span className="badge badge-yellow">📄 {result.fileName}</span>
                )}
                {result.reviewId && (
                  <span className="badge badge-green">💾 Saved</span>
                )}
              </div>
              <div className="results-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleShare}
                  disabled={sharing}
                  title="Generate a shareable link for this review"
                >
                  {sharing ? '⏳ Sharing...' : '🔗 Share'}
                </button>
              </div>
            </div>

            {/* Share URL banner */}
            {shareUrl && (
              <div className="share-banner">
                🔗 Share link (copied!): <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
              </div>
            )}

            {/* Quality Score */}
            <ScoreCard score={result.qualityScore} />

            {/* Summary */}
            {result.summary && (
              <div className="summary-card card">
                <div className="section-label">
                  <span className="dot" style={{ background: 'var(--accent-blue)' }} />
                  Overall Summary
                </div>
                <p className="summary-text">{result.summary}</p>
              </div>
            )}

            {/* Result tabs */}
            <div className="result-tabs">
              <button
                className={`result-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabChange('overview')}
              >
                🔍 Issues
                {(result.bugs?.length + result.securityIssues?.length) > 0 && (
                  <span className="tab-count-badge">
                    {result.bugs.length + result.securityIssues.length}
                  </span>
                )}
              </button>
              <button
                className={`result-tab ${activeTab === 'before-after' ? 'active' : ''}`}
                onClick={() => handleTabChange('before-after')}
              >
                ↔ Before / After
              </button>
              <button
                className={`result-tab ${activeTab === 'eli5' ? 'active' : ''}`}
                onClick={() => handleTabChange('eli5')}
              >
                🧒 Explain Simply
              </button>
            </div>

            {/* ── Tab: Overview ── */}
            {activeTab === 'overview' && (
              <div className="tab-content fade-in">
                <IssueList type="bugs" items={result.bugs || []} />
                <IssueList type="security" items={result.securityIssues || []} />
                <IssueList type="improvements" items={result.improvements || []} />
              </div>
            )}

            {/* ── Tab: Before / After ── */}
            {activeTab === 'before-after' && (
              <div className="tab-content fade-in">
                {/* Diff View */}
                {inputMode === 'paste' ? (
                  <DiffView
                    originalCode={code}
                    fixedCode={result.fixedCode}
                    language={result.language}
                  />
                ) : (
                  <CodeBlock
                    code={result.fixedCode}
                    language={result.language}
                    label="fixed"
                  />
                )}
                {/* Copy button removed — already in DiffView */}
              </div>
            )}

            {/* ── Tab: ELI5 ── */}
            {activeTab === 'eli5' && (
              <div className="tab-content fade-in">
                <div className="eli5-card card">
                  <div className="eli5-header">
                    <span className="eli5-emoji">🧒</span>
                    <div>
                      <h3>Explain Like I'm 5</h3>
                      <p className="text-secondary" style={{ fontSize: '13px' }}>
                        Simple, jargon-free explanation of what your code does and what's wrong
                      </p>
                    </div>
                  </div>
                  <div className="eli5-text">{result.explainSimple}</div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
