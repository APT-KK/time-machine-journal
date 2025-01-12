import React  , {useState} from "react";
import { Link ,  Navigate , useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PORT = 8000;

const Signup = () => {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const {setIsAuthenticated} = useAuth();

const navigate = useNavigate();

const handleSignUp = async (e) => {
  e.preventDefault();
  setError("");
  
  try {
    const response = await fetch(`http://localhost:${PORT}/api/auth/signup`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "Accept": "application/json"
       },
      credentials : 'include',
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    //Added Error Handling 
    if ( response.status === 409) {
      setError(data.message || "UserName or Email already exists Please try again!");
    } else if (!response.ok) {
      setError(data.message || "Sign Up failed. Please try again!");
     } else {
      setIsAuthenticated(true);
      navigate("/", {replace: true});
     }

  } catch (error) {
    console.error("Signup failed:", error);
  }
 };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Sign up:</h1>
        {/*Error handling*/}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" >
            Signup
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;