import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sessionService } from '../../../Auth/data/sessionService';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="p-4 bg-gray-800 shadow-md flex justify-between items-center">
      {/* Make the logo a clickable link to Home */}
      <Link to="/" className="text-xl font-bold text-blue-500 hover:text-blue-400 transition">
        CineView
      </Link>
      
      <div className="flex items-center space-x-6">
        {/* Add a clickable Search Link */}
        <Link 
          to="/search" 
          className={`text-sm font-semibold transition ${
            location.pathname === '/search' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
          }`}
        >
          🔍 Search
        </Link>

        <span className="text-sm text-gray-400 border border-gray-600 px-2 py-1 rounded hidden md:inline-block">
          {location.pathname}
        </span>
        <button 
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white px-3 py-1 bg-gray-700 hover:bg-red-600 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};