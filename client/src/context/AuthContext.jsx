import React,{ useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/auth/verify", {
          credentials : 'include' ,
      });
        setIsAuthenticated(response.ok);

      } catch (error) {
        console.error("Error in checking authentication:", error);
        setIsAuthenticated(false);
     } 
    };

    checkAuth();
   } , []);

   return (
    <AuthContext.Provider value={[isAuthenticated , setIsAuthenticated]}>
        {children}
    </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);

