import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CommunicationsList from './pages/CommunicationsList';
import CommunicationDetail from './pages/CommunicationDetail';
import Submit from './pages/Submit';

export default function App() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'border-b-2 border-white pb-0.5 font-medium' : 'opacity-70 hover:opacity-100 transition-opacity';

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-purple-800 text-white px-6 py-4 flex items-center gap-8 shadow">
          <span className="text-xl font-bold tracking-wide">DeepPurple</span>
          <NavLink to="/" end className={navClass}>Dashboard</NavLink>
          <NavLink to="/communications" className={navClass}>Communications</NavLink>
          <NavLink
            to="/submit"
            className="ml-auto bg-white text-purple-800 px-4 py-1.5 rounded-full font-semibold hover:bg-purple-100 transition-colors"
          >
            Analyse Text
          </NavLink>
        </nav>
        <main className="px-6 py-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/communications" element={<CommunicationsList />} />
            <Route path="/communications/:id" element={<CommunicationDetail />} />
            <Route path="/submit" element={<Submit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
