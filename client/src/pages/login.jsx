import React  , {useState} from "react";
import { Link , useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();

    if (response.ok) {
      navigate("/");  
    } else {
      console.error("Login failed:", data.message);
    }

  } catch (error) {
    console.error("Login failed:", error);
  }
 };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Login :</h1>
        <form onSubmit={handleLogin}>
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
            Login
          </button>
        </form> 
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p> 
      </div>
    </div>
  );
};

export default Login;