import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5ff', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Rainbow strip */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg,#7c3aed,#a855f7,#ec4899,#f59e0b,#10b981)' }} />

      {/* Minimal nav */}
      <nav style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
        >
          <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#lg_si)"/>
            <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2"/>
            <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
            <defs>
              <linearGradient id="lg_si" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="font-syne font-extrabold text-[15px]" style={{ color: '#1a0a2e' }}>DeepPurple</span>
        </button>
        <Link to="/submit" style={{ fontSize: '13px', color: '#9580c0', textDecoration: 'none' }}>
          Continue as guest →
        </Link>
      </nav>

      {/* Form card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Welcome chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.08)', borderRadius: '100px', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>👋</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>Welcome back</span>
          </div>

          <h1 className="font-syne font-extrabold" style={{ fontSize: '36px', color: '#1a0a2e', lineHeight: 1.1, letterSpacing: '-0.8px', marginBottom: '8px' }}>
            Sign in<span style={{ color: '#a855f7' }}>_</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#9580c0', marginBottom: '32px' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #ede8fb', padding: '8px 0', fontSize: '15px', color: '#1a0a2e', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.15s' }}
                onFocus={e => (e.target.style.borderBottomColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderBottomColor = '#ede8fb')}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #ede8fb', padding: '8px 0', fontSize: '15px', color: '#1a0a2e', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.15s' }}
                onFocus={e => (e.target.style.borderBottomColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderBottomColor = '#ede8fb')}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '100px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.3)', fontFamily: "'Inter', sans-serif", transition: 'opacity 0.15s' }}
            >
              {loading ? 'Signing in…' : "Let's go →"}
            </button>
          </form>
        </div>
      </div>

      {/* Faded bottom emotion chips */}
      <div style={{ padding: '24px 40px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['😊 Joy', '😤 Frustration', '😌 Calm', '🤩 Excitement', '😠 Anger', '😢 Sadness'].map((chip, i) => (
          <div
            key={chip}
            style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '100px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#9580c0', opacity: i < 3 ? 0.7 : 0.35 }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
}
