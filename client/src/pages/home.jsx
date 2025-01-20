import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/hero';
import Features from '../components/Features';
import CallToAction from '../components/CallToAction';
import Default from '../components/Default';
import { useAuth } from '../context/AuthContext';
const PORT = 8000;

const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/auth/logout`, {
        method: "POST",
        credentials: 'include'
      });
      setIsAuthenticated(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error in logging out:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navigation Bar */}
      <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Time Machine
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="
                    px-4 py-2 
                    text-white 
                    bg-gradient-to-r from-red-500 to-red-600 
                    rounded-lg
                    hover:from-red-600 hover:to-red-700
                    transform hover:-translate-y-0.5 
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                  "
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="
                      px-4 py-2 
                      text-white 
                      bg-gradient-to-r from-blue-500 to-blue-600 
                      rounded-lg
                      hover:from-blue-600 hover:to-blue-700
                      transform hover:-translate-y-0.5 
                      transition-all duration-200
                      shadow-md hover:shadow-lg
                    "
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="
                      px-4 py-2 
                      text-white 
                      bg-gradient-to-r from-green-500 to-green-600 
                      rounded-lg
                      hover:from-green-600 hover:to-green-700
                      transform hover:-translate-y-0.5 
                      transition-all duration-200
                      shadow-md hover:shadow-lg
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative">
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isAuthenticated ? <Features /> : <Default />}
          </div>
          <CallToAction />
        </div>
      </div>
    </main>
  );
};

export default Home;