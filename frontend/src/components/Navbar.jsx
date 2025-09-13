import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText, Home, LogOut, LogIn, UserPlus, LinkIcon } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold text-blue-600 tracking-wide"
        >
          TaskFlow
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
              >
                <Home size={18} />
                Home
              </Link>
              <Link
                to="/notes"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
              >
                <FileText size={18} />
                Notes
              </Link>
              <Link
                to="/shorten"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
              >
                <LinkIcon size={18} /> Shorten URL
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors font-medium text-sm sm:text-base"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1 bg-blue-600 text-white font-semibold py-1 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-sm sm:text-base"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;