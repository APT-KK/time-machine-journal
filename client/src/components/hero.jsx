import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#A9C9FF] to-[#FFBBEC] py-16 text-white">
    <div className="container mx-auto max-w-6xl px-8 flex justify-between">
      <div className="max-w-2xl animate-fadeIn">
        <h1 className="text-5xl font-bold mb-4 animate-slideUp">Time Machine Journal</h1>
        <p className="text-xl mb-8 opacity-90 font-['Lucida Grande'] animate-slideUp">
          Embark on a nostalgic journey through time as you delve into the depths of your memories.
          Take the opportunity to document your experiences, carefully tracking your moods and emotions along the way.
          So, gather your thoughts and start your adventure — the past awaits!
        </p>
        <button className="bg-white text-[#2414d0d0] px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all animate-slideUp hover:-translate-y-1">
          Sign Up
        </button>
      </div>      
    </div>
  </section>
  );
};

export default Hero;