import React  , {useState} from "react";
import { Link ,  Navigate , useNavigate } from "react-router-dom";

const Signup = () => {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const Navigate = useNavigate();

const handleSignUp = async (e) => {
  e.preventDefault();
  // API call to backend 
  try {
    const response = await fetch("http://localhost:8001/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    
    if (response.ok) {
      Navigate("/");  
    }

  } catch (error) {
    console.error("Signup failed:", error);
  }
 };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Sign up:</h1>
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