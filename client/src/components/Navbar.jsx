import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../config/config';

const Navbar = ({ isAuthenticated, setIsAuthenticated, isHomePage = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_ROUTES.AUTH.LOGOUT}`, {
        method: "POST",
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Error in logging out:", error);
    }
  };
  
  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="cursor-pointer">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Time Machine Journal
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 
                         transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Back to Home
              </button>
            )}
            {isHomePage && (
              isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 
                           text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 
                           transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link
                    to="/login"
                    className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 
                             transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 
                             text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 
                             transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
