import React , {useState , useEffect} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import Hero from '../components/hero';
import Features from '../components/Features';
import CallToAction from '../components/CalltoAction';
import Default from '../components/Default';


const Home = () => {
  const [isAuthenticated , setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

   const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: 'include'
     });
     setIsAuthenticated(false);
     navigate('/');
    } catch (error) {
      console.error("Error in logging out:", error);
    }
   };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className= " p-4 shadow">
        <div className="flex justify-end ">
         { isAuthenticated ? (
            <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
         ) : (
          <>
          <Link
          to="/login"
          className="px-4 py-2 mr-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Sign Up
        </Link>
        </>
       )
      }
        </div>
      </nav>
      <Hero />
       {isAuthenticated ? <Features /> : <Default />}
      <CallToAction />
    </main>
  );
};

export default Home;