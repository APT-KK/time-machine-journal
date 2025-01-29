import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock } from 'lucide-react';
import { API_ROUTES } from '../config/config';

const PORT = 8000;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (response.status === 409) {
        setError(data.message || "Username or Email already exists. Please try again!");
      } else if (!response.ok) {
        setError(data.message || "Sign up failed. Please try again!");
      } else {
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Begin your journaling adventure</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <div className="bg-white h-full flex items-center px-2 sm:px-3 border-r border-gray-300">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full py-2 sm:py-3 px-3 sm:px-4 text-sm focus:outline-none bg-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <div className="bg-white h-full flex items-center px-2 sm:px-3 border-r border-gray-300">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full py-2 sm:py-3 px-3 sm:px-4 text-sm focus:outline-none bg-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <div className="bg-white h-full flex items-center px-2 sm:px-3 border-r border-gray-300">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full py-2 sm:py-3 px-3 sm:px-4 text-sm focus:outline-none bg-white"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                     hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg 
                     transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;