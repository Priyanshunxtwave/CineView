import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sessionService } from '../../../Auth/data/sessionService';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login', { replace: true });
  };

  const linkClass = (path: string) =>
    `text-sm font-semibold transition ${
      location.pathname === path
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-md flex justify-between items-center border-b border-slate-200 dark:border-gray-700">
      <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition">
        CineView
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/search" className={linkClass('/search')}>
          Search
        </Link>
        <Link to="/settings" className={linkClass('/settings')}>
          Settings
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-white dark:text-gray-300 px-3 py-1 bg-slate-200 hover:bg-red-600 dark:bg-gray-700 dark:hover:bg-red-600 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};