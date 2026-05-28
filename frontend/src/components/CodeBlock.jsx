import React, { useState } from 'react';
import { useToast } from '../services/ToastContext';
import './CodeBlock.css';

/**
 * Code display block with copy button and optional label
 */
export default function CodeBlock({ code, label, language, showCopy = true, hideContent = false }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy — please select manually.', 'error');
    }
  };

  return (
    <div className="code-block">
      {/* Header bar */}
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        {label && <span className="code-block-label">{label}</span>}
        {language && (
          <span className="code-block-lang">{language}</span>
        )}
        {showCopy && (
          <button
            className={`code-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code content */}
      {!hideContent && (
        <pre className="code-block-content">
          <code>{code || '// No code to display'}</code>
        </pre>
      )}
    </div>
  );
}
