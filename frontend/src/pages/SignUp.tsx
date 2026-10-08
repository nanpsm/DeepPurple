import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const FEATURES = [
  {
    cls: 'feat1',
    iconBg: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    emoji: '🎭',
    title: '7 emotions detected',
    body: 'Joy, Anger, Fear, Sadness, Surprise, Disgust, Trust — scored and ranked instantly by Gemini AI.',
  },
  {
    cls: 'feat2',
    iconBg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    emoji: '📊',
    title: 'Dashboard & history',
    body: 'Every result saved to your account. See customer sentiment trends over 7 days across all channels.',
  },
  {
    cls: 'feat3',
    iconBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    emoji: '📝',
    title: 'Support tickets, reviews & social',
    body: 'Analyse any customer communication — paste text from any source and get a full breakdown.',
  },
];

function FieldInput({
  type, value, onChange, placeholder, label,
}: {
  type: string; value: string; onChange: (v: string) => void; placeholder: string; label: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `2px solid ${focused ? '#7c3aed' : '#e2d9f5'}`, fontSize: '15px', color: '#1a0a2e', padding: '6px 0 11px', fontFamily: "'Inter', sans-serif", transition: 'border-bottom-color 0.2s', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf8ff', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '5px', background: 'linear-gradient(90deg,#ef4444,#f97316,#a855f7,#22c55e,#3b82f6)' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '20px' }}>📬</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '28px', color: '#1a0a2e', letterSpacing: '-0.6px', marginBottom: '12px' }}>Check your email</h2>
            <p style={{ fontSize: '14px', color: '#9580c0', lineHeight: 1.7, marginBottom: '32px' }}>
              We sent a confirmation link to <strong style={{ color: '#1a0a2e' }}>{email}</strong>.<br />
              Click it to activate your account, then sign in.
            </p>
            <button
              onClick={() => navigate('/signin')}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '100px', padding: '14px 32px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', fontFamily: "'Inter', sans-serif" }}
            >
              Go to sign in →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8ff', fontFamily: "'Inter', sans-serif", color: '#1a0a2e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <style>{`
        .su-placeholder::placeholder { color: #c4b5d8; }
        .cursor { display:inline-block; color:#a855f7; animation:blink 1s steps(1) infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .feat1 { animation: slideUp 0.5s ease both 0.1s; }
        .feat2 { animation: slideUp 0.5s ease both 0.25s; }
        .feat3 { animation: slideUp 0.5s ease both 0.4s; }
      `}</style>

      {/* Rainbow strip */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg,#ef4444,#f97316,#a855f7,#22c55e,#3b82f6)', flexShrink: 0 }} />

      {/* Navbar */}
      <nav style={{ height: '54px', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(253,248,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(237,232,251,0.7)', flexShrink: 0 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
          <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#lg_su)" />
            <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2" />
            <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
            <defs>
              <linearGradient id="lg_su" x1="0" y1="0" x2="34" y2="34">
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
        <div style={{ width: '52%', padding: '44px 64px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            {/* Chip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.07)', border: '1.5px solid rgba(124,58,237,0.15)', borderRadius: '100px', padding: '5px 14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px' }}>🎉</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed' }}>It's free forever</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '46px', lineHeight: 1.07, letterSpacing: '-1.6px', color: '#1a0a2e', margin: '0 0 30px' }}>
              Start reading<br />emotions<br />today.<span className="cursor">_</span>
            </h1>

            {/* Google SSO */}
            <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: '#fff', border: '1.5px solid #e2d9f5', borderRadius: '100px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#1a0a2e', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '22px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
              {GOOGLE_SVG}
              Sign up with Google
            </button>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ flex: 1, height: '1px', background: '#ede8fb' }} />
              <span style={{ fontSize: '12px', color: '#b8aece', fontWeight: 500 }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: '#ede8fb' }} />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
                <FieldInput type="text" label="First name" value={firstName} onChange={setFirstName} placeholder="Jane" />
                <FieldInput type="text" label="Last name" value={lastName} onChange={setLastName} placeholder="Smith" />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <FieldInput type="email" label="Email" value={email} onChange={setEmail} placeholder="jane@company.com" />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <FieldInput type="password" label="Password" value={password} onChange={setPassword} placeholder="Min. 6 characters" />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '100px', padding: '14px 38px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 22px rgba(124,58,237,0.32)', letterSpacing: '-0.1px', fontFamily: "'Inter', sans-serif" }}
              >
                {loading ? 'Creating account…' : 'Create my account →'}
              </button>

              <p style={{ marginTop: '14px', fontSize: '12px', color: '#b8aece', lineHeight: 1.5 }}>
                By signing up you agree to our{' '}
                <a href="#" style={{ color: '#7c3aed', textDecoration: 'none' }}>Terms</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#7c3aed', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#9580c0' }}>
                Already have an account?{' '}
                <Link to="/signin" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
              </p>
            </form>
          </div>

          {/* Faded chips */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', opacity: 0.35, paddingTop: '12px' }}>
            {['😤 Frustration', '😠 Anger', '😌 Calm', '😊 Joy', '🤩 Excitement', '+24 more'].map(chip => (
              <div key={chip} style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '100px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, color: '#7a6a96' }}>{chip}</div>
            ))}
          </div>
        </div>

        {/* RIGHT — Value panel */}
        <div style={{ flex: 1, background: 'linear-gradient(145deg,#f3eeff 0%,#ede8fb 40%,#e9d5ff 100%)', borderLeft: '1.5px solid #e4dbf7', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '52px 48px', position: 'relative', overflow: 'hidden' }}>

          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Eyebrow */}
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9b7fd4', marginBottom: '16px' }}>Built for your team</div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '28px', color: '#1a0a2e', letterSpacing: '-0.7px', lineHeight: 1.2, margin: '0 0 36px' }}>
              Turn customer communications<br />into actionable insights.
            </h2>

            {/* Feature cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {FEATURES.map(f => (
                <div key={f.cls} className={f.cls} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 4px 20px rgba(124,58,237,0.08)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>
                    {f.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a0a2e', marginBottom: '3px' }}>{f.title}</div>
                    <div style={{ fontSize: '13px', color: '#7a6a96', lineHeight: 1.5 }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex' }}>
                {[
                  { initial: 'J', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)', z: 3 },
                  { initial: 'M', bg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', z: 2 },
                  { initial: 'S', bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', z: 1 },
                ].map((a, i) => (
                  <div key={a.initial} style={{ width: '28px', height: '28px', borderRadius: '50%', background: a.bg, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, marginLeft: i > 0 ? '-8px' : 0, zIndex: a.z, position: 'relative' }}>
                    {a.initial}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '13px', color: '#7a6a96', lineHeight: 1.4 }}>
                <strong style={{ color: '#1a0a2e' }}>2,400+ teams</strong> already reading emotions with DeepPurple.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
