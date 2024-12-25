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
    <section className="journal-interface">
      <div className="container">
        <h2 className="section-title">Journey Entries-</h2> <br />
        <div className="interface-container">
          <div className="toolbar">
             <div className="input-container">
               <input type="text" name="text" className="input" placeholder="Search..." />
               <span className="icon"> 
                <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
               </span>
             </div>
            <button className="btn btn-primary">
              <PlusCircle /> New Entry
            </button>
          </div>
          <br />
          <div className="entries-container">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
            ) : (
              recentEntries.map(entry => (
                <div 
                  key={entry.id} 
                  className={`entry-card ${animatedEntries.includes(entry.id) ? 'animated' : ''}`}
                  style={{
                    opacity: animatedEntries.includes(entry.id) ? 1 : 0,
                    transform: animatedEntries.includes(entry.id) ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                >
                  <div className="entry-header">
                    <div>
                      <h4 className="entry-location">{entry.location}</h4>
                      <p className="entry-date">{entry.date}</p>
                    </div>
                    <span className="entry-mood">{entry.mood}</span>
                  </div>
                  <p className="entry-excerpt">{entry.excerpt}</p>
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