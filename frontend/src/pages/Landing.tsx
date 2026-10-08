import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Communication, CommunicationSource } from '../types';

const SOURCES: Array<{ value: CommunicationSource; label: string; icon: string }> = [
  { value: 'SUPPORT_TICKET', label: 'Support Ticket', icon: '🎧' },
  { value: 'PRODUCT_REVIEW', label: 'Product Review', icon: '⭐' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media', icon: '📱' },
];

function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="url(#lgLand)" />
      <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2" />
      <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      <defs>
        <linearGradient id="lgLand" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [source, setSource] = useState<CommunicationSource>('SUPPORT_TICKET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Communication | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Text must be at least 10 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitCommunication(text, source);
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg ?? 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setText('');
    setError(null);
  }

  const sentimentScore = result?.sentimentScore ?? 0;
  const sentimentPositive = sentimentScore >= 0;
  const sentimentPct = Math.round(Math.abs(sentimentScore) * 100);

  const urgency = sentimentScore < -0.6 ? 'High' : sentimentScore < -0.2 ? 'Medium' : 'Low';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5ff', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", color: '#1a0a2e' }}>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(3deg)} 50%{transform:translateY(-16px) rotate(-3deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-10px) rotate(4deg)} }
        @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(-4deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
        @keyframes float5 { 0%,100%{transform:translateY(0px) rotate(2deg)} 50%{transform:translateY(-9px) rotate(-2deg)} }
        @keyframes float6 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-11px) rotate(3deg)} }
        .lp-bg-chip { position:absolute; background:#fff; border:1.5px solid #ede8fb; border-radius:100px; padding:8px 16px; font-size:13px; font-weight:600; color:#1a0a2e; box-shadow:0 4px 16px rgba(124,58,237,0.08); white-space:nowrap; pointer-events:none; user-select:none; }
        .lp-src-btn { background:none; border:1.5px solid #ede8fb; color:#7a6a96; font-size:13px; font-weight:600; cursor:pointer; padding:8px 18px; border-radius:100px; font-family:'Inter',sans-serif; transition:border-color 0.15s,color 0.15s; }
        .lp-src-btn:hover { border-color:#a855f7; color:#7c3aed; }
        .lp-src-btn.active { background:linear-gradient(135deg,#7c3aed,#a855f7); border-color:transparent; color:#fff; box-shadow:0 4px 10px rgba(124,58,237,0.25); }
        .lp-reveal-btn { background:linear-gradient(135deg,#7c3aed,#a855f7); border:none; color:#fff; font-size:14px; font-weight:700; cursor:pointer; padding:11px 24px; border-radius:100px; font-family:'Inter',sans-serif; box-shadow:0 6px 20px rgba(124,58,237,0.38); letter-spacing:-0.1px; transition:opacity 0.15s; }
        .lp-reveal-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .lp-pill-link { display:inline-block; border-radius:100px; padding:8px 18px; font-size:13px; font-weight:600; text-decoration:none; }
      `}</style>

      {/* Sticky navbar */}
      <nav style={{ padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #ede8fb', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <LogoMark />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '16px', color: '#1a0a2e', letterSpacing: '-0.3px' }}>DeepPurple</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/signin" className="lp-pill-link" style={{ border: '1.5px solid #ede8fb', color: '#7c3aed' }}>Log in</Link>
          <Link to="/signup" className="lp-pill-link" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>Sign up free</Link>
        </div>
      </nav>

      {/* Hero + analyzer */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px 72px', position: 'relative', overflow: 'hidden' }}>

        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Floating chips */}
        <div className="lp-bg-chip" style={{ top: '40px', left: 'calc(50% - 480px)', animation: 'float1 4.2s ease-in-out infinite', opacity: 0.65 }}>😤 Frustration</div>
        <div className="lp-bg-chip" style={{ top: '80px', right: 'calc(50% - 500px)', animation: 'float2 5.1s ease-in-out infinite', opacity: 0.55 }}>😊 Joy</div>
        <div className="lp-bg-chip" style={{ top: '200px', left: 'calc(50% - 540px)', animation: 'float3 3.8s ease-in-out infinite', opacity: 0.45 }}>😌 Calm</div>
        <div className="lp-bg-chip" style={{ top: '160px', right: 'calc(50% - 460px)', animation: 'float4 4.6s ease-in-out infinite', opacity: 0.6 }}>🤩 Excitement</div>
        <div className="lp-bg-chip" style={{ top: '320px', left: 'calc(50% - 500px)', animation: 'float5 5.4s ease-in-out infinite', opacity: 0.35 }}>😠 Anger</div>
        <div className="lp-bg-chip" style={{ top: '280px', right: 'calc(50% - 520px)', animation: 'float6 4.0s ease-in-out infinite', opacity: 0.4 }}>😨 Fear</div>

        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#fde68a,#fbcfe8,#ddd6fe)', borderRadius: '100px', padding: '6px 20px', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4c1d95' }}>✨ AI-powered emotion analysis</span>
          </div>
          <h1 style={{ margin: '0 0 14px', fontFamily: "'Syne', sans-serif", fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', color: '#1a0a2e', lineHeight: 1.08 }}>
            Understand what your{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>customers</span>
            <br />are really feeling 🎭
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#7a6a96', lineHeight: 1.6, maxWidth: '440px' }}>
            Paste any customer communication and get a full emotional breakdown instantly.
          </p>
        </div>

        {/* Analyzer card */}
        {!result ? (
          <form onSubmit={handleAnalyze} style={{ width: '100%', maxWidth: '620px', background: '#fff', border: '2px solid #ede8fb', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 56px rgba(124,58,237,0.12), 0 4px 16px rgba(124,58,237,0.07)', position: 'relative', zIndex: 1 }}>

            {/* Source type row */}
            <div style={{ padding: '22px 24px 0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#a090bc', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>What type of customer communication?</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SOURCES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    className={`lp-src-btn${source === s.value ? ' active' : ''}`}
                    onClick={() => setSource(s.value)}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient divider */}
            <div style={{ margin: '18px 24px 0', height: '1.5px', background: 'linear-gradient(90deg,#ede8fb,#fce7f3 50%,#ede8fb)' }} />

            {/* Textarea */}
            <div style={{ padding: '16px 24px 0' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste a customer support ticket, review or post… 💬"
                maxLength={2000}
                style={{ width: '100%', height: '118px', background: 'none', border: 'none', resize: 'none', color: '#1a0a2e', fontSize: '15px', fontFamily: "'Inter', sans-serif", lineHeight: 1.65, outline: 'none' }}
              />
            </div>

            {error && <p style={{ margin: '0 24px 8px', fontSize: '13px', color: '#ef4444' }}>{error}</p>}

            {/* Footer row */}
            <div style={{ padding: '12px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1.5px solid #f5f0fd' }}>
              <span style={{ fontSize: '12px', color: '#c4b5d8', fontWeight: 500 }}>{text.length} / 2000 characters</span>
              <button type="submit" className="lp-reveal-btn" disabled={loading}>
                {loading ? 'Analysing…' : 'Reveal emotions ✨'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ width: '100%', maxWidth: '620px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <button onClick={reset} style={{ background: 'none', border: '1.5px solid #ede8fb', color: '#7c3aed', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '7px 16px', borderRadius: '100px', fontFamily: "'Inter', sans-serif" }}>
              Analyse another ↺
            </button>
          </div>
        )}

        {/* Sign-in nudge */}
        {!result && (
          <p style={{ margin: '18px 0 0', fontSize: '13px', color: '#b8aece', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Link to="/signin" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            {' '}or{' '}
            <Link to="/signup" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>sign up free</Link>
            {' '}to track customer sentiment trends over time 📈
          </p>
        )}

        {/* Results */}
        {result && (
          <div style={{ width: '100%', maxWidth: '620px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>

            {/* Sentiment */}
            <div style={{ background: sentimentPositive ? '#f0fdf4' : '#fff5f5', border: `2px solid ${sentimentPositive ? '#bbf7d0' : '#fecaca'}`, borderRadius: '18px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{sentimentPositive ? '😊' : '😤'}</span>
                <span style={{ fontSize: '14px', color: '#7a6a96', fontWeight: 600 }}>Sentiment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ height: '7px', width: '110px', background: sentimentPositive ? '#dcfce7' : '#fee2e2', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${sentimentPct}%`, height: '100%', background: sentimentPositive ? 'linear-gradient(90deg,#4ade80,#16a34a)' : 'linear-gradient(90deg,#f87171,#dc2626)', borderRadius: '100px' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: sentimentPositive ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap' }}>
                  {sentimentPositive ? 'Positive' : 'Negative'} · {sentimentPct}%
                </span>
              </div>
            </div>

            {/* Emotions detected */}
            {result.primaryEmotion && (
              <div style={{ background: '#fff', border: '2px solid #ede8fb', borderRadius: '18px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>🎭</span>
                  <span style={{ fontSize: '14px', color: '#7a6a96', fontWeight: 600 }}>Emotions detected</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', background: '#fce7f3', color: '#be185d', borderRadius: '100px', padding: '6px 14px', fontWeight: 700, border: '1.5px solid #fbcfe8' }}>
                    {result.primaryEmotion}
                  </span>
                  {result.emotionScores && Object.entries(result.emotionScores)
                    .filter(([k]) => k !== result.primaryEmotion?.toLowerCase())
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .filter(([, v]) => v > 0.12)
                    .map(([emotion]) => (
                      <span key={emotion} style={{ fontSize: '13px', background: '#f5f3ff', color: '#5b21b6', borderRadius: '100px', padding: '6px 14px', fontWeight: 700, border: '1.5px solid #ddd6fe' }}>
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Urgency + Key topic grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#fff7ed', border: '2px solid #fed7aa', borderRadius: '18px', padding: '18px 22px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>🚨 Urgency</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#ea580c', lineHeight: 1 }}>{urgency}</div>
              </div>
              <div style={{ background: '#f5f3ff', border: '2px solid #ddd6fe', borderRadius: '18px', padding: '18px 22px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>💬 Key Topic</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: '#4c1d95', lineHeight: 1.2 }}>
                  {result.topics?.[0] ?? 'General'}
                </div>
              </div>
            </div>

            {/* Save nudge */}
            <div style={{ background: 'linear-gradient(135deg,#faf5ff,#fdf2f8)', border: '2px solid #e9d5ff', borderRadius: '18px', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a0a2e', marginBottom: '3px' }}>💾 Save this result?</div>
                <div style={{ fontSize: '12px', color: '#a090bc' }}>Sign in to save results and track trends.</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/signin" className="lp-pill-link" style={{ border: '1.5px solid #ede8fb', color: '#7c3aed', background: '#fff' }}>Log in</Link>
                <Link to="/signup" className="lp-pill-link" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff' }}>Sign up free 🎉</Link>
              </div>
            </div>

            {/* Summary */}
            {result.summary && (
              <div style={{ background: '#fff', border: '2px solid #ede8fb', borderRadius: '18px', padding: '18px 24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#a090bc', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>📝 Summary</div>
                <p style={{ margin: 0, fontSize: '14px', color: '#1a0a2e', lineHeight: 1.6 }}>{result.summary}</p>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
