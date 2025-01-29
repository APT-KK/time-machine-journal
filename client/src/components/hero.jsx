import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-[#FAD961] to-[#F76B1C] py-8 sm:py-12 md:py-16 text-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 flex flex-col items-center">
        <div className="max-w-5xl animate-fadeIn">
          <h1 className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Welcome to
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold animate-slideUp bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Time Machine Journal
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-center mb-6 sm:mb-8 opacity-90 
                        font-['Lucida Grande'] animate-slideUp break-words">
            Embark on a nostalgic journey through time as you delve into the depths of your memories.
            Take the opportunity to document your experiences, carefully tracking your moods and emotions along the way.
            So, gather your thoughts and start your adventure — the past awaits!
          </p>
        </div>      
      </div>
    </section>
  );
};

export default Hero;