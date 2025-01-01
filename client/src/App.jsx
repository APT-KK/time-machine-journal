import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';
import Entry from './pages/textEditor';

function App() {
  console.log("App component is rendering");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element= {<Signup />} />
        <Route path="/journal-entry" element={<Entry />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
