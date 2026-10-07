import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CommunicationsList from './pages/CommunicationsList';
import CommunicationDetail from './pages/CommunicationDetail';
import Submit from './pages/Submit';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="url(#lg_app)"/>
      <path d="M7 10C7 8.34 8.34 7 10 7H24C25.66 7 27 8.34 27 10V19C27 20.66 25.66 22 24 22H19.5L16 26L12.5 22H10C8.34 22 7 20.66 7 19V10Z" fill="white" fillOpacity="0.2"/>
      <path d="M11 13.5 C12.2 13.5 12.2 12 13.4 12 C14.6 12 14.6 15 15.8 15 C17 15 17 12 18.2 12 C19.4 12 19.4 13.5 20.6 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17 C13 17 13 16 14 16 C15 16 15 18 16 18 C17 18 17 16 18 16 C19 16 19 17 20 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
      <defs>
        <linearGradient id="lg_app" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="h-[54px] px-10 flex items-center justify-between sticky top-0 z-10 border-b border-[#ede8fb]"
      style={{ background: '#fff' }}
    >
      <button
        className="flex items-center gap-2"
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <LogoMark />
        <span className="font-syne font-extrabold text-[15px] tracking-tight" style={{ color: '#1a0a2e' }}>
          DeepPurple
        </span>
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1 border border-yellow-300"
              style={{ background: 'linear-gradient(135deg,#fef9c3,#fde68a)' }}
            >
              <span className="text-sm">🔥</span>
              <span className="font-syne font-extrabold text-[13px] text-amber-800">7</span>
              <span className="text-[11px] font-semibold text-amber-700">day streak</span>
            </div>
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
              title={user.email ?? ''}
              onClick={signOut}
            >
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/signin')}
              className="text-purple-700 text-sm font-medium border border-[#ede8fb] rounded-full px-4 py-1.5 hover:bg-[#f3eeff] transition-colors"
              style={{ background: 'none' }}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/submit')}
              className="text-sm font-semibold text-white rounded-full px-4 py-1.5 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            >
              Analyse text ✨
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-24" style={{ background: '#f8f5ff' }}>
      <TopBar />
      <main className="px-10 py-7 max-w-[1200px] mx-auto">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/submit" element={<AppShell><Submit /></AppShell>} />
      <Route path="/dashboard" element={<AppShell><ProtectedRoute><Dashboard /></ProtectedRoute></AppShell>} />
      <Route path="/history" element={<AppShell><ProtectedRoute><CommunicationsList /></ProtectedRoute></AppShell>} />
      <Route path="/history/:id" element={<AppShell><ProtectedRoute><CommunicationDetail /></ProtectedRoute></AppShell>} />
      <Route path="/communications" element={<Navigate to="/history" replace />} />
      <Route path="/communications/:id" element={<Navigate to="/history" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
