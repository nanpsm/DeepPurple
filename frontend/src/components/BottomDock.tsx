import { useNavigate, useLocation } from 'react-router-dom';

function DockItem({ icon, label, path, active }: { icon: string; label: string; path: string | null; active: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => path && navigate(path)}
      className="flex flex-col items-center gap-1 px-3.5 py-2 rounded-2xl min-w-[60px] transition-all"
      style={active
        ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }
        : undefined}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: active ? '#fff' : '#9580c0' }}>
        {label}
      </span>
    </button>
  );
}

export default function BottomDock() {
  const { pathname } = useLocation();
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1.5 rounded-3xl px-5 py-2.5 border border-[#ede8fb]"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(124,58,237,0.18)' }}
      >
        <DockItem icon="🏠" label="Dashboard" path="/dashboard" active={pathname === '/dashboard'} />
        <DockItem icon="🕐" label="History" path="/history" active={pathname === '/history'} />
        <DockItem icon="✨" label="Analyze" path="/submit" active={pathname === '/submit'} />
        <div className="w-px h-9 bg-[#ede8fb] mx-1" />
        <DockItem icon="⚙️" label="Settings" path={null} active={false} />
      </div>
    </div>
  );
}
