import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { API_ROUTES } from '../config/config';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const MoodTracking = () => {

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API_ROUTES.ENTRIES, {
        credentials: 'include',
        method: 'GET',
      });

      if(!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load entries. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mood Journey
              </h1>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No entries found. Start writing to track your moods!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="p-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: entry.mood ? moodColors[entry.mood]?.light || moodColors.Neutral.light : moodColors.Neutral.light,
                      borderLeft: `4px solid ${entry.mood ? moodColors[entry.mood]?.base || moodColors.Neutral.base : moodColors.Neutral.base}`
                    }}
                    onClick={() => {
                      navigate(`/entry/${entry._id}`);
                    }}
                  >
                    <div className="flex  flex-col justify-between items-start mb-4">
                     <h2 className="text-2xl font-semibold text-gray-800 break-words">{entry.title}</h2>
                    <div className="flex gap-3 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1 break-all">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {entry.location}
                      </span>
                      <span className="text-gray-400 relative" style={{ top: '2px' }}>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 relative" style={{ top: '2px' }}>•</span>
                      <span 
                        className="px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: entry.mood ? moodColors[entry.mood]?.base || moodColors.Neutral.base : moodColors.Neutral.base,
                          color: 'white'
                        }}
                      >
                        <Heart className="w-4 h-4" />
                        {entry.mood || 'Neutral'}
                      </span>
                    </div>
                    </div>
                   <div className="prose max-w-none break-words">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {entry.content.length > 50 ? `${entry.content.substring(0, 50)}...` : entry.content}
                      </ReactMarkdown>
                    </div>              
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodTracking;