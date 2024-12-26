import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Hero from './components/hero';
import Features from './components/Features';
import JournalInterface from './components/JournalInterface';
import CallToAction from './components/CalltoAction';

function App() {
  console.log("App component rendering");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Features />
            <JournalInterface />
            <CallToAction />
          </main>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
