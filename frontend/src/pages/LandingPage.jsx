import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import './LandingPage.css';

const WORDS = ['Bugs', 'Security Issues', 'Code Smells', 'Vulnerabilities', 'Bad Practices'];

const TESTIMONIALS = [
  { name: 'Sarah Chen', handle: '@sarahcodes', role: 'Senior Engineer', text: 'CodeSense AI caught a subtle race condition that 3 senior devs missed in PR review. Saved us hours of debugging.' },
  { name: 'Alex Rivera', handle: '@arivera_dev', role: 'Full Stack Dev', text: 'The auto-fix feature is magic. I paste a messy function and it returns perfectly formatted, secure code in 2 seconds.' },
  { name: 'David Kim', handle: '@dkim_tech', role: 'CTO at Startup', text: 'We mandated CodeSense for all junior devs before opening PRs. Code quality went up 40% in a month.' }
];

const FAQS = [
  { q: 'Is it really free?', a: 'Yes! Core features are completely free forever. We believe every developer deserves access to secure coding tools.' },
  { q: 'What programming languages are supported?', a: 'CodeSense AI supports 15+ languages including JavaScript, Python, Java, C++, Go, Rust, and Ruby.' },
  { q: 'Is my code safe?', a: 'Absolutely. We do not store your code for training purposes, and all data is encrypted in transit and at rest.' },
  { q: 'How is it different from ChatGPT?', a: 'CodeSense is purpose-built for code review. It runs specialized security scans, provides a structured quality score, and directly isolates bugs instead of generating generic text.' }
];

// SVG Icons
const IconLightning = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const IconArrowRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconBug = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4"/><path d="M8 14H4"/><path d="M20 14h-4"/><path d="M6.9 19.3c-1.32-1.32-1.9-3.26-1.9-5.3"/><path d="M17.1 19.3c1.32-1.32 1.9-3.26 1.9-5.3"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>;
const IconLightbulb = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const IconChart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const IconSparkles = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const IconShare = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>;

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const word = WORDS[wordIndex];
    let t;
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75);
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    else { setDeleting(false); setWordIndex(i => (i + 1) % WORDS.length); }
    return () => clearTimeout(t);
  }, [displayed, deleting, wordIndex]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="lp">

      {/* NAVBAR */}
      <header className="lp-nav">
        <div className="lp-nav-inner glass-panel">
          <div className="lp-logo">
            <span className="lp-logo-icon">⟨/⟩</span>
            <span className="lp-logo-text">CodeSense <span>AI</span></span>
          </div>
          <nav className={`lp-nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)}>Reviews</a>
          </nav>
          <div className="lp-nav-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>Get Started</button>
          </div>
          <button className="lp-hamburger" onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            CodeSense AI 2.0 is Live
          </div>

          <h1 className="lp-title">
            Instantly Detect
            <br />
            <span className="lp-title-accent">
              <span className="lp-typing">{displayed}</span>
              <span className="lp-cursor">|</span>
            </span>
            <br />
            In Your Code
          </h1>

          <p className="lp-subtitle">
            Ship secure, bug-free code 10x faster. CodeSense AI acts as your senior pair programmer, scanning every line for errors and providing one-click fixes.
          </p>

          <div className="lp-hero-btns">
            {user ? (
              <button className="btn btn-primary btn-lg glow-effect" onClick={() => navigate('/review')}>
                <IconLightning /> Go to Dashboard
              </button>
            ) : (
              <>
                <button className="btn btn-primary btn-lg glow-effect" onClick={() => navigate('/signup')}>
                  Start for Free <IconArrowRight />
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                  View Demo
                </button>
              </>
            )}
          </div>

          {/* Dashboard Preview (Professional IDE style) */}
          <div className="lp-preview">
            <div className="lp-preview-glow" />
            <div className="lp-preview-window glass-panel">
              <div className="lp-preview-bar">
                <div className="lp-preview-dots">
                  <span className="pd red" /><span className="pd yellow" /><span className="pd green" />
                </div>
                <span className="lp-preview-title">authController.js — CodeSense Analysis</span>
              </div>
              <div className="lp-preview-body">
                <div className="lpb-stats">
                  <div className="lpb-stat"><span className="lpb-stat-val red">1</span><span className="lpb-stat-lbl">Critical Bug</span></div>
                  <div className="lpb-stat"><span className="lpb-stat-val orange">2</span><span className="lpb-stat-lbl">Security Issues</span></div>
                  <div className="lpb-stat"><span className="lpb-stat-val cyan">64/100</span><span className="lpb-stat-lbl">Quality Score</span></div>
                  <div className="lpb-stat"><span className="lpb-stat-val green">3</span><span className="lpb-stat-lbl">Improvements</span></div>
                </div>
                <div className="lpb-main">
                  <div className="lpb-code">
                    <pre className="lpb-code-body">{`<span class="syntax-keyword">function</span> <span class="syntax-func">getUser</span>(id) {
  <span class="syntax-keyword">const</span> query = <span class="syntax-string">"SELECT * FROM users WHERE id = "</span> + id;
  <span class="syntax-keyword">return</span> db.<span class="syntax-func">run</span>(query);
}

<span class="syntax-keyword">const</span> JWT_SECRET = <span class="syntax-string">"super_secret_dev_key_123"</span>;`}</pre>
                  </div>
                  <div className="lpb-issues">
                    <div className="lpb-issue red"><IconBug /> <span>SQL Injection vulnerability detected on line 2.</span></div>
                    <div className="lpb-issue orange"><IconShield /> <span>Hardcoded JWT secret exposed in source code.</span></div>
                    <div className="lpb-issue cyan"><IconLightbulb /> <span>Use parameterized queries for database execution.</span></div>
                    <div className="lpb-issue cyan"><IconLightbulb /> <span>Move secrets to environment variables (.env).</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By */}
          <div className="lp-trusted">
            <p>TRUSTED BY DEVELOPERS BUILDING WITH</p>
            <div className="lp-trusted-logos">
              <span>React</span>
              <span>Node.js</span>
              <span>Python</span>
              <span>MongoDB</span>
              <span>AWS</span>
              <span>Docker</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-workflow" id="how-it-works">
        <ScrollReveal>
          <div className="lp-section-head">
            <span className="lp-tag">Workflow</span>
            <h2 className="lp-section-title">How CodeSense Works</h2>
            <p className="lp-section-sub">From messy code to production-ready in 3 simple steps</p>
          </div>
        </ScrollReveal>
        
        <div className="lp-workflow-steps">
          <ScrollReveal delayClass="delay-100">
            <div className="lp-step">
              <div className="lp-step-num">01</div>
              <h3>Paste or Upload</h3>
              <p>Drop your code snippet or upload a file. We support over 15+ programming languages natively.</p>
            </div>
          </ScrollReveal>
          <div className="lp-step-connector" />
          <ScrollReveal delayClass="delay-200">
            <div className="lp-step">
              <div className="lp-step-num">02</div>
              <h3>AI Deep Scan</h3>
              <p>Our proprietary AI models analyze syntax, logic, and security vulnerabilities in milliseconds.</p>
            </div>
          </ScrollReveal>
          <div className="lp-step-connector" />
          <ScrollReveal delayClass="delay-300">
            <div className="lp-step">
              <div className="lp-step-num">03</div>
              <h3>Review & Fix</h3>
              <p>Get a detailed breakdown of issues and a fully corrected version of your code ready to copy.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* BENTO BOX FEATURES */}
      <section className="lp-bento" id="features">
        <ScrollReveal>
          <div className="lp-section-head">
            <span className="lp-tag">Features</span>
            <h2 className="lp-section-title">Everything you need to ship faster</h2>
            <p className="lp-section-sub">A complete toolchain for code quality, built on advanced LLMs.</p>
          </div>
        </ScrollReveal>

        <div className="lp-bento-grid">
          {/* Main Large Card */}
          <ScrollReveal className="lp-bento-card large glass-panel" delayClass="delay-100">
            <div className="lp-bento-content">
              <h3>One-Click Auto Fix</h3>
              <p>Don't just find the bugs, fix them automatically. CodeSense generates perfectly formatted, secure replacement code instantly.</p>
            </div>
            <div className="lp-bento-visual diff-visual">
              <div className="bento-diff-row red">- if(user.role == "admin")</div>
              <div className="bento-diff-row green">+ if(user?.role === "admin")</div>
            </div>
          </ScrollReveal>

          {/* Medium Card */}
          <ScrollReveal className="lp-bento-card medium glass-panel" delayClass="delay-200">
            <div className="lp-bento-content">
              <h3>Security Audits</h3>
              <p>Detect SQL injection, XSS, and exposed secrets before they reach production.</p>
            </div>
            <div className="lp-bento-visual sec-visual">
              <span className="sec-badge"><IconShield /> 0 Vulnerabilities</span>
            </div>
          </ScrollReveal>

          {/* Small Cards */}
          <ScrollReveal className="lp-bento-card small glass-panel" delayClass="delay-100">
            <div className="lp-bento-content">
              <div className="lp-feat-icon"><IconChart /></div>
              <h3>Quality Scoring</h3>
              <p>Objective 0-100 metrics.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lp-bento-card small glass-panel" delayClass="delay-200">
            <div className="lp-bento-content">
              <div className="lp-feat-icon"><IconSparkles /></div>
              <h3>ELI5 Explanations</h3>
              <p>Complex code made simple.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal className="lp-bento-card wide glass-panel" delayClass="delay-300">
            <div className="lp-bento-content">
              <h3>Shareable Reports</h3>
              <p>Generate permanent links to your code reviews to share with your team or attach to Pull Requests.</p>
            </div>
            <div className="lp-bento-visual-bg">
              <IconShare />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-testimonials" id="testimonials">
        <ScrollReveal>
          <div className="lp-section-head">
            <span className="lp-tag">Wall of Love</span>
            <h2 className="lp-section-title">Loved by Developers</h2>
          </div>
        </ScrollReveal>
        
        <div className="lp-test-grid">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} className="lp-test-card glass-panel" delayClass={`delay-${(i + 1) * 100}`}>
              <div className="lp-test-header">
                <div className="lp-test-avatar">{t.name.charAt(0)}</div>
                <div className="lp-test-meta">
                  <div className="lp-test-name">{t.name}</div>
                  <div className="lp-test-handle">{t.handle} • {t.role}</div>
                </div>
              </div>
              <p className="lp-test-body">"{t.text}"</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq" id="faq">
        <ScrollReveal>
          <div className="lp-section-head">
            <h2 className="lp-section-title">Frequently Asked Questions</h2>
          </div>
        </ScrollReveal>
        
        <div className="lp-faq-list">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} delayClass={`delay-${(i % 3 + 1) * 100}`}>
              <div className={`lp-faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
                <div className="lp-faq-q">
                  {faq.q}
                  <span className="lp-faq-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                </div>
                <div className="lp-faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="lp-cta" id="cta">
          <div className="lp-cta-glow" />
          <ScrollReveal className="lp-cta-inner glass-panel">
            <span className="lp-tag">Get Started Today</span>
            <h2 className="lp-cta-title">Ready to write<br />better code?</h2>
            <p className="lp-cta-sub">Free forever. No credit card needed. Start in 30 seconds.</p>
            <button className="btn btn-primary btn-lg glow-effect" onClick={() => navigate('/signup')}>
              Start for Free <IconArrowRight />
            </button>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">
          <span className="lp-logo-icon">⟨/⟩</span>
          <span>CodeSense <span>AI</span></span>
        </div>
        <p className="lp-footer-copy">Built for modern developers. Secure, fast, and free forever.</p>
      </footer>
    </div>
  );
}
