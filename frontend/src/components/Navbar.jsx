import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText } from 'lucide-react';
import { LogOut, LogIn, UserPlus, LinkIcon } from 'lucide-react';


const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          TaskFlow
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
             <Link to="/notes" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FileText size={18} />
                Notes
              </Link>
            <Link to="/shorten" className='flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors'>
            <LinkIcon size={18}/> Shorten URL
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
              >
              <LogOut size={18} />
              Logout
            </button>
              </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/signup" className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
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