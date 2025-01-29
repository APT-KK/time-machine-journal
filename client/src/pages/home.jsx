import React from 'react';
import Hero from '../components/hero';
import Features from '../components/Features';
import CallToAction from '../components/CallToAction';
import Default from '../components/Default';
import Navbar from '../components/Navbar'; 
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <Navbar 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated}
        isHomePage={true} 
      />
      
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>     
        <div className="relative">
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isAuthenticated ? <Features /> : <Default />}
          </div>
          {isAuthenticated && <CallToAction />}
        </div>
      </div>
    </main>
  );
};

export default Home;