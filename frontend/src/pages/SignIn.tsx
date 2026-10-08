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
    <div style={{ minHeight: '100vh', background: '#fdf8ff', fontFamily: "'Inter', sans-serif", color: '#1a0a2e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <style>{`
        .si-field-input { width:100%; background:transparent; border:none; border-bottom:2px solid #e2d9f5; font-size:16px; color:#1a0a2e; padding:6px 0 12px; font-family:'Inter',sans-serif; transition:border-bottom-color 0.2s; outline:none; }
        .si-field-input:focus { border-bottom-color:#7c3aed; }
        .si-field-input::placeholder { color:#c4b5d8; }
        .cursor { display:inline-block; color:#a855f7; animation:blink 1s steps(1) infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes orbit-joy { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(4px)} }
        @keyframes orbit-frus { 0%,100%{transform:translateY(4px)} 50%{transform:translateY(-4px)} }
        @keyframes orbit-ang { 0%,100%{transform:translateX(-4px)} 50%{transform:translateX(4px)} }
        @keyframes orbit-calm { 0%,100%{transform:translateX(4px)} 50%{transform:translateX(-4px)} }
      `}</style>

      {/* Rainbow strip */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg,#ef4444,#f97316,#a855f7,#22c55e,#3b82f6)', flexShrink: 0 }} />

      {/* Navbar */}
      <nav style={{ height: '54px', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(253,248,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(237,232,251,0.7)', flexShrink: 0 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
          <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#lg_si)" />
            <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2" />
            <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
            <defs>
              <linearGradient id="lg_si" x1="0" y1="0" x2="34" y2="34">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '15px', color: '#1a0a2e', letterSpacing: '-0.2px' }}>DeepPurple</span>
        </button>
        <Link to="/" style={{ fontSize: '13px', color: '#9580c0', textDecoration: 'none' }}>← Back to home</Link>
      </nav>

      {/* Split body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* LEFT — Form */}
        <div style={{ width: '52%', padding: '56px 64px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            {/* Welcome chip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.07)', border: '1.5px solid rgba(124,58,237,0.15)', borderRadius: '100px', padding: '5px 14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '13px' }}>✨</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed' }}>Welcome back</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '50px', lineHeight: 1.07, letterSpacing: '-1.8px', color: '#1a0a2e', marginBottom: '38px', margin: '0 0 38px' }}>
              Let's pick up<br />where you<br />left off.<span className="cursor">_</span>
            </h1>

            {/* Google SSO */}
            <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: '#fff', border: '1.5px solid #e2d9f5', borderRadius: '100px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#1a0a2e', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '26px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
              <div style={{ flex: 1, height: '1px', background: '#ede8fb' }} />
              <span style={{ fontSize: '12px', color: '#b8aece', fontWeight: 500 }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: '#ede8fb' }} />
            </div>

            <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                Email address
              </div>
              <input
                type="email"
                className="si-field-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Password</span>
                <a href="#" style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, textDecoration: 'none', textTransform: 'none', letterSpacing: 0 }}>Forgot?</a>
              </div>
              <input
                type="password"
                className="si-field-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
              />
            </div>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '100px', padding: '14px 38px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 22px rgba(124,58,237,0.32)', letterSpacing: '-0.1px', fontFamily: "'Inter', sans-serif" }}
              >
                {loading ? 'Signing in…' : "Let's go →"}
              </button>

              <p style={{ marginTop: '18px', fontSize: '13px', color: '#9580c0' }}>
                New here?{' '}
                <Link to="/signup" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>Create a free account</Link>
              </p>
            </form>
          </div>

          {/* Faded bottom chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0.35, paddingTop: '16px' }}>
            {['😤 Frustration', '😠 Anger', '😌 Calm', '😊 Joy', '🤩 Excitement', '+24 more'].map(chip => (
              <div key={chip} style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '100px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, color: '#7a6a96' }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Visual panel */}
        <div style={{ flex: 1, background: 'linear-gradient(145deg,#f3eeff 0%,#ede8fb 40%,#e9d5ff 100%)', borderLeft: '1.5px solid #e4dbf7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 44px', position: 'relative', overflow: 'hidden' }}>

          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

          {/* Emotion illustration */}
          <div style={{ width: '220px', height: '220px', position: 'relative', marginBottom: '36px' }}>
            {/* Outer glow ring */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)' }} />
            {/* Inner circle */}
            <div style={{ position: 'absolute', inset: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 16px 60px rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '56px' }}>🎭</span>
            </div>
            {/* Joy — top */}
            <div style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1.5px solid #ddd6fe', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: '#7c3aed', boxShadow: '0 4px 16px rgba(124,58,237,0.15)', whiteSpace: 'nowrap', animation: 'orbit-joy 3s ease-in-out infinite' }}>😊 Joy</div>
            {/* Frustration — bottom */}
            <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: '#dc2626', boxShadow: '0 4px 16px rgba(220,38,38,0.12)', whiteSpace: 'nowrap', animation: 'orbit-frus 3.4s ease-in-out infinite' }}>😤 Frustration</div>
            {/* Anger — left */}
            <div style={{ position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: '#ea580c', boxShadow: '0 4px 16px rgba(234,88,12,0.12)', whiteSpace: 'nowrap', animation: 'orbit-ang 2.8s ease-in-out infinite' }}>😠 Anger</div>
            {/* Calm — right */}
            <div style={{ position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: '#16a34a', boxShadow: '0 4px 16px rgba(22,163,74,0.10)', whiteSpace: 'nowrap', animation: 'orbit-calm 3.2s ease-in-out infinite' }}>😌 Calm</div>
          </div>

          {/* Copy */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '26px', color: '#1a0a2e', letterSpacing: '-0.6px', margin: '0 0 12px' }}>
              Know what your customers really feel.
            </h2>
            <p style={{ fontSize: '14px', color: '#7a6a96', lineHeight: 1.65, maxWidth: '280px', margin: '0 auto 28px' }}>
              Sign in to access your dashboard, track customer sentiment trends, and never lose an insight.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              {[
                { num: '7', label: 'emotions' },
                { num: '3', label: 'sources' },
                { num: '∞', label: 'history' },
              ].map((stat, i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} style={{ width: '1px', height: '32px', background: '#ddd6fe' }} />}
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '22px', color: '#7c3aed', lineHeight: 1 }}>{stat.num}</div>
                    <div style={{ fontSize: '11px', color: '#9b7fd4', fontWeight: 600, marginTop: '3px' }}>{stat.label}</div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
