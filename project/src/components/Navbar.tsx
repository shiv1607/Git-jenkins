import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, Home, Users } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'ADMIN': return '/admin';
      case 'COLLEGE': return '/college';
      case 'STUDENT': return '/student';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-xl border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:shadow-2xl transition-all duration-200">
              <Calendar className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              FestOrg
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 font-semibold ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {user && (
              <Link
                to={getDashboardRoute()}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 font-semibold ${
                  isActive(getDashboardRoute()) 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">{user.username}</div>
                    <div className="text-purple-500 text-xs uppercase tracking-wide">{user.role.toLowerCase()}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-600 rounded-lg transition-all duration-200 font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;