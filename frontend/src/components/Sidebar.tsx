import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
      <rect width="34" height="34" rx="9" fill="url(#lg_sb)"/>
      <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2"/>
      <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
      <defs>
        <linearGradient id="lg_sb" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV_ITEMS = [
  { icon: '⌂', label: 'Overview',  path: '/dashboard' },
  { icon: '✨', label: 'Analyse',   path: '/submit'    },
  { icon: '◈', label: 'History',   path: '/history'   },
];

function NavItem({ icon, label, path, active }: { icon: string; label: string; path: string; active: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 12px', borderRadius: '10px',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        background: active ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#f3eeff'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >
      <span style={{ fontSize: '15px', lineHeight: 1, width: '20px', textAlign: 'center' }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: active ? '#fff' : '#4c1d95' }}>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const firstName = user?.email?.split('@')[0] ?? '';

  return (
    <aside style={{
      width: '220px', height: '100vh', position: 'fixed', left: 0, top: 0,
      background: '#fff', borderRight: '1.5px solid #ede8fb',
      display: 'flex', flexDirection: 'column', zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f3eeff' }}>
        <LogoMark />
        <span className="font-syne font-extrabold" style={{ fontSize: '15px', color: '#1a0a2e', letterSpacing: '-0.3px' }}>
          DeepPurple
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '4px 12px 8px' }}>
          Workspace
        </p>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} {...item} active={pathname === item.path || (item.path === '/history' && pathname.startsWith('/history'))} />
        ))}

        <div style={{ height: '1px', background: '#f3eeff', margin: '12px 0' }} />

        <p style={{ fontSize: '10px', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '4px 12px 8px' }}>
          Account
        </p>
        <button
          disabled
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '9px 12px', borderRadius: '10px',
            border: 'none', cursor: 'not-allowed', textAlign: 'left',
            background: 'transparent', opacity: 0.45,
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, width: '20px', textAlign: 'center' }}>⚙</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#4c1d95' }}>Settings</span>
          <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, color: '#a855f7', background: '#f3eeff', borderRadius: '4px', padding: '1px 5px' }}>SOON</span>
        </button>
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #f3eeff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a0a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstName}</p>
            <p style={{ fontSize: '10px', color: '#9580c0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #ede8fb', background: 'transparent', fontSize: '12px', fontWeight: 600, color: '#9580c0', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
