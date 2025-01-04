import React , {useState , useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const DisplayEntries = () => {
  const navigate = useNavigate();
  const [entries , setEntries] = useState([]);
  
  useEffect(() => {
    fetchEntries();
  },[]);

  const fetchEntries = async () => {
    try {
      const response = await fetch ('http://localhost:8000/api/entries', {
        method: 'GET',  
        credentials: 'include',
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
          <h1 className="text-2xl font-bold mb-4">Your Entries: </h1>
          <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 mb-4">No entries yet!</p>
              <button 
                onClick={() => navigate('/journal-entry')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create New Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold">{entry.title}</h2>
                <div className="flex gap-2 text-sm text-gray-600 mt-1">
                  <span>{entry.location}</span>
                  <span>•</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-gray-800">
                  <ReactMarkdown className="prose" remarkPlugins = {[remarkGfm, remarkBreaks , remarkFrontmatter]}
                    rehypePlugins = {[rehypeRaw]} >
                    {entry.content}  
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

export default DisplayEntries;