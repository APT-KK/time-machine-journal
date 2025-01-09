import React , {useState , useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const MoodTracking = () => {
  const navigate = useNavigate();
  const [entries , setEntries] = useState([]);
  
  useEffect(() => {
    fetchEntries();
  },[]);

  const fetchEntries = async () => {
    try {
      const response = await fetch ('http://localhost:8001/api/entries', {
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0ED2F7] to-[#B2FEFA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-bold mb-4">Mood Tracking : </h1>
          <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 mb-4">No entries yet! Start tracking to get the mood analysis!</p>
              <button 
                onClick={() => navigate('/journal-entry')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create New Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white p-6 rounded-lg border border-gray-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()} • {entry.location}
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium hover:bg-blue-200 hover:translate-y-[-2px] hover:shadow transition-transform">
                    Mood: {entry.mood}
                  </span>
                </div>
                <div className="prose max-w-none text-gray-800">
                  <ReactMarkdown>
                    {entry.content.length > 40
                      ? `${entry.content.substring(0, 60)}...`
                      : entry.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;