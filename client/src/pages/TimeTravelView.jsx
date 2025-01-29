import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_ROUTES } from '../config/config';
import Navbar from '../components/Navbar';
import { MapPin, Calendar1 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TimeTravelView = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const navigate = useNavigate();

  //mood colors mapping
  const moodColors = {
    Happy: {
      base: '#4CAF50',
      light: '#E8F5E9'
    },
    Sad: {
      base: '#2196F3',
      light: '#E3F2FD'
    },
    Excited: {
      base: '#FFC107',
      light: '#FFF8E1'
    },
    Anxious: {
      base: '#F44336',
      light: '#FFEBEE'
    },
    Calm: {
      base: '#9C27B0',
      light: '#F3E5F5'
    },
    Neutral: {
      base: '#9E9E9E',
      light: '#F5F5F5'
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API_ROUTES.ENTRIES,{
        credentials: 'include',
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTileContent = ({ date }) => {
    const dayEntries = entries.filter(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );

    if (dayEntries.length > 0) {
      const lastEntry = dayEntries[dayEntries.length - 1]; // Using the last entry's mood for the tile color
      const moodStyle = moodColors[lastEntry.mood] || moodColors['Neutral']; 
      const confidence = lastEntry.confidence || 0.7;
      const style = {
        backgroundColor: moodStyle.base,
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: '4px',
        opacity: confidence,
      };
      return (
        <div>
          <div style={style} />
          {dayEntries.length > 1 && (
            <div className="absolute bottom-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" style={{ color: moodStyle.base }}>
              {dayEntries.length}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getTileClassName = ({ date }) => {
    const dayEntries = entries.filter(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    return dayEntries.length > 0 ? 'has-entry' : '';
  };

  const handleDateClick = (date) => {
    const dayEntries = entries.filter(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    setSelectedEntries(dayEntries);
  };

  return (
    <>
      <Navbar isAuthenticated={true} isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words">
                  Time Travel View
                </h1>
                <p className="text-gray-600 mt-2 break-words">Journey through your memories</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calendar Section */}
              <div className="calendar-container relative">
                <style> 
                  {`
                    .react-calendar {
                      width: 100%;
                      background: white;
                      border: none;
                      font-family: inherit;
                      line-height: 1.125em;
                      padding: 1rem;
                      border-radius: 0.5rem;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .react-calendar__tile {
                      position: relative;
                      height: 60px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: none;
                      color: #374151;
                    }
                    .react-calendar__month-view__days__day {
                      padding: 1em 0.5em;
                    }
                    .react-calendar__tile--now {
                      background: #f3f4f6;
                    }
                    .react-calendar__tile--active {
                      background: #dbeafe !important;
                      color: #1e40af;
                    }
                    .react-calendar__tile.has-entry {
                      font-weight: bold;
                      color: #1e40af;
                    }
                    .react-calendar__navigation {
                      margin-bottom: 1rem;
                    }
                    .react-calendar__navigation button {
                      min-width: 44px;
                      background: none;
                      font-size: 1rem;
                      padding: 0.5rem;
                      border-radius: 0.375rem;
                      color: #374151;
                    }
                    .react-calendar__navigation button:enabled:hover,
                    .react-calendar__navigation button:enabled:focus {
                      background-color: #f3f4f6;
                    }
                    .react-calendar__month-view__weekdays {
                      text-align: center;
                      text-transform: uppercase;
                      font-weight: bold;
                      font-size: 0.75em;
                      color: #6b7280;
                    }
                  `}
                </style>
                <Calendar 
                  onChange={handleDateClick}
                  tileContent={getTileContent}
                  tileClassName={getTileClassName}
                  className="rounded-lg shadow-md w-full"
                />
                
                {/* Mood Legend */}
                <div className="mt-6 p-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Mood Legend</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(moodColors).map(([mood, color]) => (
                      <div key={mood} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color.base }}
                        />
                        <span className="text-gray-700">{mood}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entry Display Section */}
              {selectedEntries.length > 0 && (
                <div className="space-y-6">
                  {selectedEntries.map((entry) => (
                    <div 
                      key={entry._id}
                      className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                      onClick={() => navigate(`/entry/${entry._id}`)}
                    >
                      <h2 className="text-2xl font-bold mb-4 break-words">{entry.title}</h2>
                      <div className="flex gap-3 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1 break-all">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          {entry.location}
                        </span>
                        <span className="text-gray-400 relative" style={{ top: '5px' }}>•</span>

                        <span className="flex items-center gap-1">
                         <Calendar1 className="w-4 h-4" />
                         {new Date(entry.date).toLocaleDateString()}
                        </span>
                        
                        <span className="text-gray-400 relative" style={{ top: '5px' }}>•</span>
                        
                        <span className="px-2 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: moodColors[entry.mood]?.base || moodColors['Neutral'].base,
                            color: 'white'
                          }}>
                          {entry.mood}
                        </span>
                      </div>
                      <div className="prose max-w-none mt-4 break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {entry.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTravelView; 