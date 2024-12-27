import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { recentEntries } from '../data/sampleData';
import LoadingCard from './LoadingCard';

const JournalInterface = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedEntries, setAnimatedEntries] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    recentEntries.forEach((entry, index) => {
      setTimeout(() => {
        setAnimatedEntries(prev => [...prev, entry.id]);
      }, index * 200);
    });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Journey Entries</h2>
        <div className="bg-gray-100 rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-56 h-10 px-4 border-2 border-black focus:outline-none focus:border-black focus:shadow-[-5px_-5px_0px_black] transition-all duration-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {/* Search icon */}
              </span>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-transform">
              <PlusCircle className="w-5 h-5" />
              New Entry
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
            ) : (
              recentEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:translate-x-2 ${
                    animatedEntries.includes(entry.id) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{entry.location}</h4>
                      <p className="text-gray-500 text-sm">{entry.date}</p>
                    </div>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-gray-600">{entry.excerpt}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalInterface;
