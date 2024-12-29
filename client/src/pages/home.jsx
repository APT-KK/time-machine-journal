import React from 'react';
import Hero from '../components/hero';
import Features from '../components/Features';
import JournalInterface from '../components/JournalInterface';
import CallToAction from '../components/CalltoAction';

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <Features />
      <JournalInterface />
      <CallToAction />
    </main>
  );
};

export default Home;