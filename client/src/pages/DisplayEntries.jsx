import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, MapPin, Calendar, Heart } from 'lucide-react';
import { API_ROUTES } from '../config/config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const DisplayEntries = () => {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API_ROUTES.ENTRIES, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid response format');
      }

      setEntries(Array.isArray(data) ? data : []);

    } catch (error) {
      setError('Failed to fetch entries');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(API_ROUTES.ENTRY(id), {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchEntries();
    } catch (error) {
      setError('Failed to delete entry');
      console.error('Error:', error);
    }
  };

  const handleUpdate = (entryId) => {
    navigate(`/journal-entry/${entryId}`);
  };

  if (loading) {
        return (
            <div className='text-left'>
                <div className="loader w-14 aspect-[2] bg-custom-gradient bg-no-repeat bg-[length:calc(100%/3)_50%] animate-l3">
                </div>
            </div>   
        );
    }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words">
                Your Journal Entries
              </h1>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 break-words">No entries found. Start writing to track your journey!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 break-words">{entry.title}</h3>
                        <div className="flex gap-3 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1 break-all">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {entry.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {entry.mood}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleUpdate(entry._id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(entry._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 prose max-w-none break-words">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
                        rehypePlugins={[rehypeRaw]}
                      >
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
    </>
  );
};

export default DisplayEntries;