import React, { useState, useEffect, useCallback } from 'react';
import { getHistory, deleteReview, clearHistory, getReviewById } from '../services/api';
import { useToast } from '../services/ToastContext';
import ScoreCard from '../components/ScoreCard';
import CodeBlock from '../components/CodeBlock';
import IssueList from '../components/IssueList';
import './HistoryPage.css';

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailTab, setDetailTab] = useState('issues');
  const { addToast } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getHistory(page, 10);
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSelect = async (review) => {
    if (selected?._id === review._id) return;
    setLoadingDetail(true); setDetailTab('issues');
    try {
      const data = await getReviewById(review._id);
      setSelected(data.review);
    } catch {
      setSelected(review);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      setReviews(p => p.filter(r => r._id !== id));
      if (selected?._id === id) setSelected(null);
      addToast('Review deleted.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleClear = async () => {
    if (!window.confirm('Delete ALL history?')) return;
    try {
      await clearHistory();
      setReviews([]); setSelected(null); setPagination(null);
      addToast('History cleared.', 'success');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const scoreColor = (s) =>
    s >= 80 ? 'var(--green)' : s >= 50 ? 'var(--yellow)' : 'var(--red)';

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="hp">
      <div className="hp-container">

        {/* Header */}
        <div className="hp-header">
          <div>
            <h1 className="hp-title">📋 Review History</h1>
            <p className="hp-subtitle">All your past code reviews saved in MongoDB.</p>
          </div>
          {reviews.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClear}>🗑 Clear All</button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="hp-center">
            <div className="spinner spinner-accent" />
            <p>Loading history...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="hp-center">
            <span style={{ fontSize: '40px', opacity: 0.3 }}>🔌</span>
            <h3>Could not load history</h3>
            <p>{error}</p>
            <button className="btn btn-ghost btn-sm" onClick={fetchHistory} style={{ marginTop: '8px' }}>Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reviews.length === 0 && (
          <div className="hp-center">
            <span style={{ fontSize: '40px', opacity: 0.25 }}>📭</span>
            <h3>No reviews yet</h3>
            <p>Your code reviews will appear here.</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && reviews.length > 0 && (
          <div className="hp-body">

            {/* List */}
            <div className="hp-list">
              {reviews.map(r => (
                <div
                  key={r._id}
                  className={`hp-item ${selected?._id === r._id ? 'active' : ''}`}
                  onClick={() => handleSelect(r)}
                >
                  <div className="hp-item-top">
                    <span className="badge badge-blue">{r.language || 'Unknown'}</span>
                    <span className="hp-score" style={{ color: scoreColor(r.qualityScore) }}>
                      {r.qualityScore}/100
                    </span>
                  </div>
                  <div className="hp-preview">
                    {(r.originalCode || '').substring(0, 80).replace(/\n/g, ' ').trim()}...
                  </div>
                  {r.fileName && <div className="hp-filename">📄 {r.fileName}</div>}
                  <div className="hp-item-bottom">
                    <span className="hp-date">{formatDate(r.createdAt)}</span>
                    <button className="hp-del" onClick={e => handleDelete(r._id, e)}>✕</button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="hp-pagination">
                  <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span className="hp-page-info">{page} / {pagination.totalPages}</span>
                  <button className="btn btn-ghost btn-sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="hp-detail">
              {loadingDetail && (
                <div className="hp-center"><div className="spinner spinner-accent" /></div>
              )}
              {!loadingDetail && !selected && (
                <div className="hp-center">
                  <span style={{ fontSize: '40px', opacity: 0.25 }}>👈</span>
                  <h3>Select a review</h3>
                  <p>Click any item to see full details.</p>
                </div>
              )}
              {!loadingDetail && selected && (
                <div className="fade-in">
                  <div className="hp-detail-header">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{selected.language}</span>
                      {selected.fileName && <span className="badge badge-yellow">📄 {selected.fileName}</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(selected.createdAt)}</span>
                  </div>

                  <ScoreCard score={selected.qualityScore} />

                  {selected.summary && (
                    <div className="card hp-summary">
                      <div className="section-label mb-12">
                        <span className="dot" style={{ background: 'var(--accent)' }} /> Summary
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.summary}</p>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="hp-tabs">
                    {['issues', 'code', 'eli5'].map(t => (
                      <button key={t} className={`hp-tab ${detailTab === t ? 'active' : ''}`} onClick={() => setDetailTab(t)}>
                        {t === 'issues' ? '🔍 Issues' : t === 'code' ? '↔ Fixed Code' : '🧒 ELI5'}
                      </button>
                    ))}
                  </div>

                  {detailTab === 'issues' && (
                    <div className="hp-tab-content">
                      <IssueList type="bugs" items={selected.bugs || []} />
                      <IssueList type="security" items={selected.securityIssues || []} />
                      <IssueList type="improvements" items={selected.improvements || []} />
                    </div>
                  )}
                  {detailTab === 'code' && (
                    <div className="hp-tab-content">
                      {selected.fixedCode
                        ? <CodeBlock code={selected.fixedCode} language={selected.language} label="fixed" />
                        : <div className="hp-center"><p>No fixed code available.</p></div>
                      }
                    </div>
                  )}
                  {detailTab === 'eli5' && (
                    <div className="hp-tab-content">
                      <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '28px' }}>🧒</span>
                          <h3 style={{ fontWeight: 700 }}>Simple Explanation</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                          {selected.explainSimple || 'No explanation available.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}