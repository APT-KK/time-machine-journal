import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';

function App() {
  console.log("App component is rendering");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element= {<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
