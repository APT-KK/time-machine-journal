import React , {useState , useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const MoodTracking = () => {
  const navigate = useNavigate();
  const [entries , setEntries] = useState([]);
  
  useEffect(() => {
    fetchEntries();
  },[]);

  const fetchEntries = async () => {
    try {
      const response = await fetch (`${config.BASE_URL}/api/entries`, {
        credentials: 'include',
        method: 'GET',
      });

      if(!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch entries. Please try again!');
    }
  };

  const fetchMoodData = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/entries/moods`, {
        // ... rest of fetch config
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mood Journey
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Back to Home
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">Track your emotional journey through journaling</p>
              <button 
                onClick={() => navigate('/journal-entry')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Start Tracking
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry._id} 
                     className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{entry.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(entry.date).toLocaleDateString()} • {entry.location}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 
                                   rounded-full font-medium transition-transform hover:scale-105">
                      {entry.mood}
                    </span>
                  </div>
                  <div className="mt-4 prose max-w-none">
                    <ReactMarkdown>
                      {entry.content.length > 40 ? `${entry.content.substring(0, 60)}...` : entry.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;