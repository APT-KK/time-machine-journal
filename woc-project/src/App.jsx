import React from 'react';
import Hero from './components/hero';
import Features from './components/Features';
import JournalInterface from './components/JournalInterface';
import CallToAction from './components/CalltoAction';

function App() {
  console.log("App component rendering");
  return (
    <div className="app">
      <main>
        <Hero />
        <Features />
        <JournalInterface />
        <CallToAction />
      </main>
    </div>
  );
}

export default App;
