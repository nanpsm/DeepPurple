import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CommunicationsList from './pages/CommunicationsList';
import CommunicationDetail from './pages/CommunicationDetail';
import Submit from './pages/Submit';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function NavBar() {
  const { user, signOut } = useAuth();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'border-b-2 border-white pb-0.5 font-medium' : 'opacity-70 hover:opacity-100 transition-opacity';

  return (
    <nav className="bg-purple-800 text-white px-6 py-4 flex items-center gap-6 shadow">
      <NavLink to="/" className="text-xl font-bold tracking-wide">DeepPurple</NavLink>
      {user && (
        <>
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          <NavLink to="/history" className={navClass}>History</NavLink>
        </>
      )}
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm opacity-70 hidden sm:block">{user.email}</span>
            <button
              onClick={signOut}
              className="border border-white/40 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/signin" className="border border-white/40 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Sign in
          </NavLink>
        )}
        <NavLink
          to="/submit"
          className="bg-white text-purple-800 px-4 py-1.5 rounded-full font-semibold hover:bg-purple-100 transition-colors"
        >
          Analyse Text
        </NavLink>
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><CommunicationsList /></ProtectedRoute>} />
      <Route path="/history/:id" element={<ProtectedRoute><CommunicationDetail /></ProtectedRoute>} />
      <Route path="/communications" element={<Navigate to="/history" replace />} />
      <Route path="/communications/:id" element={<Navigate to="/history" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="px-6 py-8 max-w-7xl mx-auto">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
