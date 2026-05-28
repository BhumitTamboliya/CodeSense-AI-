import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedReview } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import CodeBlock from '../components/CodeBlock';
import IssueList from '../components/IssueList';
import './SharedReviewPage.css';

export default function SharedReviewPage() {
  const { shareId } = useParams();
  const [review, setReview]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSharedReview(shareId);
        setReview(data.review);
      } catch (err) {
        setError(err.message || 'Review not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareId]);

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ marginTop: '80px' }}>
          <div className="spinner spinner-blue" />
          <p>Loading shared review...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ marginTop: '80px' }}>
          <span className="icon">🔗</span>
          <h3>Review Not Found</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
            Go to Code Review
          </Link>
        </div>
      </div>
    );
  }

  // ── Review view ───────────────────────────────────────────────────────
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

  return (
    <div className="shared-review-page">
      <div className="page-container">

        {/* Shared badge + CTA */}
        <div className="shared-topbar">
          <div className="shared-badge">
            🔗 Shared Review
          </div>
          <Link to="/" className="btn btn-primary btn-sm">
            ⚡ Try CodeSense AI
          </Link>
        </div>

        {/* Review header */}
        <div className="shared-header fade-in">
          <div className="shared-meta">
            <span className="badge badge-blue">{review.language}</span>
            {review.fileName && (
              <span className="badge badge-yellow">📄 {review.fileName}</span>
            )}
          </div>
          <h1 className="shared-title">
            Code Review — <span style={{ color: 'var(--accent-blue)' }}>{review.language}</span>
          </h1>
          <p className="shared-date">Reviewed on {formatDate(review.createdAt)}</p>
        </div>

        {/* Score */}
        <div className="fade-in" style={{ animationDelay: '0.05s' }}>
          <ScoreCard score={review.qualityScore} />
        </div>

        {/* Summary */}
        {review.summary && (
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="section-label mb-12">
              <span className="dot" style={{ background: 'var(--accent-blue)' }} />
              Summary
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {review.summary}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="result-tabs fade-in" style={{ animationDelay: '0.15s' }}>
          <button
            className={`result-tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            🔍 Issues
          </button>
          <button
            className={`result-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            ↔ Fixed Code
          </button>
          <button
            className={`result-tab ${activeTab === 'eli5' ? 'active' : ''}`}
            onClick={() => setActiveTab('eli5')}
          >
            🧒 ELI5
          </button>
        </div>

        {/* Tab: Issues */}
        {activeTab === 'issues' && (
          <div className="tab-content fade-in">
            <IssueList type="bugs"         items={review.bugs || []} />
            <IssueList type="security"     items={review.securityIssues || []} />
            <IssueList type="improvements" items={review.improvements || []} />
          </div>
        )}

        {/* Tab: Fixed Code */}
        {activeTab === 'code' && (
          <div className="tab-content fade-in">
            {review.fixedCode ? (
              <CodeBlock
                code={review.fixedCode}
                language={review.language}
                label="fixed code"
              />
            ) : (
              <div className="empty-state" style={{ padding: '32px' }}>
                <p>No fixed code available for this review.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: ELI5 */}
        {activeTab === 'eli5' && (
          <div className="tab-content fade-in">
            <div className="card">
              <div className="eli5-block-header">
                <span style={{ fontSize: '32px' }}>🧒</span>
                <div>
                  <h3 style={{ fontWeight: 700 }}>Explain Like I'm 5</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Jargon-free explanation of the code and its issues
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {review.explainSimple || 'No explanation available.'}
              </p>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="shared-footer fade-in">
          <p>Want to review your own code?</p>
          <Link to="/" className="btn btn-primary">
            ⚡ Try CodeSense AI — It's Free
          </Link>
        </div>

      </div>
    </div>
  );
}
