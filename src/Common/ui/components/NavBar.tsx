import { useNavigate, useLocation } from 'react-router-dom';
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
      <div className="text-xl font-bold text-blue-500">CineView</div>
      <div className="flex items-center space-x-6">
        <span className="text-sm text-gray-400 border border-gray-600 px-2 py-1 rounded">
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