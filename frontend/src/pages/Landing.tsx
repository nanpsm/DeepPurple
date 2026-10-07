import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="url(#lg_land)"/>
      <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2"/>
      <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
      <defs>
        <linearGradient id="lg_land" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ background: '#f8f5ff', color: '#1a0a2e', fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1.5px solid #ede8fb', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogoMark />
          <span className="font-syne font-extrabold text-[15px] tracking-tight" style={{ color: '#1a0a2e' }}>DeepPurple</span>
        </div>
        {user ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-700 text-sm font-semibold border border-[#ede8fb] rounded-full px-4 py-1.5 hover:bg-[#f3eeff] transition-colors"
            style={{ background: 'none' }}
          >
            Dashboard →
          </button>
        ) : (
          <button
            onClick={() => navigate('/signin')}
            className="text-purple-700 text-sm font-medium border border-[#ede8fb] rounded-full px-4 py-1.5 hover:bg-[#f3eeff] transition-colors"
            style={{ background: 'none' }}
          >
            Sign in
          </button>
        )}
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 48px 72px', background: '#f8f5ff' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 65% 30%, rgba(124,58,237,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '1184px', margin: '0 auto' }}>
          {/* Floating chips */}
          {[
            { text: '😤 Frustration', top: '-10px', right: '200px', rotate: '-4deg' },
            { text: '😊 Joy', top: '60px', right: '60px', rotate: '3deg' },
            { text: '😌 Calm', top: '160px', right: '160px', rotate: '-2deg' },
            { text: '🤩 Excitement', top: '240px', right: '40px', rotate: '5deg' },
            { text: '😠 Anger', top: '300px', right: '230px', rotate: '-3deg', opacity: '0.6' },
          ].map(chip => (
            <div
              key={chip.text}
              style={{
                position: 'absolute', top: chip.top, right: chip.right,
                transform: `rotate(${chip.rotate})`, opacity: chip.opacity ?? 1,
                background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '100px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: '#1a0a2e',
                boxShadow: '0 4px 16px rgba(124,58,237,0.10)', whiteSpace: 'nowrap',
              }}
            >
              {chip.text}
            </div>
          ))}

          <h1 className="font-syne font-extrabold" style={{ fontSize: '62px', lineHeight: 1.08, color: '#1a0a2e', maxWidth: '720px', letterSpacing: '-1.5px' }}>
            Understand every emotion<br />
            behind{' '}
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              every word.
            </span>
          </h1>
          <p style={{ marginTop: '20px', fontSize: '18px', color: '#7a6a96', maxWidth: '500px', lineHeight: 1.6 }}>
            DeepPurple detects frustration, joy, anger and more — instantly, from any text. Built for teams who care about what customers really feel.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }}>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', fontFamily: "'Inter', sans-serif" }}
            >
              Start for free →
            </button>
            <button
              onClick={() => navigate('/submit')}
              style={{ background: '#fff', color: '#7c3aed', border: '1.5px solid #ede8fb', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              Try as guest
            </button>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <div style={{ background: '#fff', borderTop: '1.5px solid #ede8fb', borderBottom: '1.5px solid #ede8fb', padding: '20px 48px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <span style={{ fontSize: '13px', color: '#9580c0', fontWeight: 500, whiteSpace: 'nowrap' }}>Trusted by 2,400+ support teams</span>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Acme Corp', 'Helios', 'Velocity', 'Novatech'].map(name => (
            <span key={name} style={{ fontSize: '12px', fontWeight: 600, color: '#c4b5fd', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{name}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#fff', borderTop: '1.5px solid #ede8fb' }}>
        <section style={{ padding: '80px 48px', maxWidth: '1184px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>What you get</p>
          <h2 className="font-syne font-extrabold" style={{ fontSize: '36px', color: '#1a0a2e', marginBottom: '40px', letterSpacing: '-0.8px', lineHeight: 1.15 }}>
            Everything you need to<br />understand your customers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {[
              { icon: '🔍', title: 'Instant detection', desc: 'Detect frustration, joy, calm and 20+ emotions in seconds from any customer message.' },
              { icon: '📊', title: 'Trend tracking', desc: 'See emotional patterns across all your communications over time with beautiful charts.' },
              { icon: '⚡', title: 'Any text source', desc: 'Support tickets, reviews, social posts, emails — paste anything and get instant insights.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '20px', padding: '28px 26px' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a0a2e', marginBottom: '8px' }}>{f.title}</div>
                <p style={{ fontSize: '14px', color: '#7a6a96', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <div style={{ background: '#f8f5ff' }}>
        <div style={{ padding: '80px 48px', maxWidth: '1184px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>How it works</p>
          <h2 className="font-syne font-extrabold" style={{ fontSize: '36px', color: '#1a0a2e', marginBottom: '40px', letterSpacing: '-0.8px' }}>Three steps to clarity</h2>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { n: '1', title: 'Paste your text', desc: 'Drop in any customer message, review, or social post.' },
              { n: '2', title: 'AI detects emotions', desc: 'Our model analyses tone, sentiment, and emotional signals.' },
              { n: '3', title: 'See detailed insights', desc: 'Get a full breakdown — scores, topics, and a summary.' },
            ].map((step, i) => (
              <div key={step.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px', position: 'relative', ...(i < 2 ? { borderRight: '1px solid #ede8fb' } : {}) }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <span className="font-syne font-extrabold" style={{ fontSize: '18px', color: '#fff' }}>{step.n}</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a0a2e', marginBottom: '6px' }}>{step.title}</div>
                <p style={{ fontSize: '13px', color: '#9580c0', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', padding: '56px 48px', display: 'flex', justifyContent: 'center', gap: '80px' }}>
        {[
          { num: '94%', label: 'average confidence score' },
          { num: '20+', label: 'emotion types detected' },
          { num: '148K', label: 'texts analyzed' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div className="font-syne font-extrabold" style={{ fontSize: '52px', color: '#fff', lineHeight: 1, letterSpacing: '-2px' }}>{s.num}</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1.5px solid #ede8fb', padding: '36px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <LogoMark size={22} />
            <span className="font-syne font-extrabold" style={{ fontSize: '14px', color: '#1a0a2e' }}>DeepPurple</span>
          </div>
          <p style={{ fontSize: '12px', color: '#9580c0' }}>AI-powered emotion intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '13px', color: '#9580c0', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#c4b5fd' }}>© 2026 DeepPurple. All rights reserved.</span>
      </footer>
    </div>
  );
}
