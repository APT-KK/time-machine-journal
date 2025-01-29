import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { MapPin, Calendar, Heart, Edit2, Trash2 } from 'lucide-react';
import { API_ROUTES } from '../config/config';
import Navbar from '../components/Navbar';

const EntryView = () => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const { entryId } = useParams();

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
      fetchEntry();
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      const response = await fetch(API_ROUTES.ENTRY(entryId), {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Response not ok:', response.status);
        throw new Error('Failed to fetch entry');
      }

      const data = await response.json();

      setEntry(data.entry); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching entry:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(API_ROUTES.ENTRY(entryId), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      navigate('/mood-tracking');
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleEdit = () => {
    navigate(`/journal-entry/${entryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="text-center text-white">
          <p>{error || 'Entry not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} isHomePage={false} />
      <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold text-gray-800 break-words">{entry.title}</h1>
              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Entry"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 text-sm text-gray-600 mb-6">
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

            <div className="prose max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
                rehypePlugins={[rehypeRaw]}
              >
                {entry.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntryView;
