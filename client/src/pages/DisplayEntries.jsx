import React , {useState , useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, MapPin, Calendar } from 'lucide-react';

const DisplayEntries = () => {
  const navigate = useNavigate();
  const [entries , setEntries] = useState([]);
  
  useEffect(() => {
    fetchEntries();
  },[]);

  async function fetchEntries () {
    try {
      const response = await fetch ('http://localhost:8000/api/entries', {
        method: 'GET',  
        credentials: 'include',
      });

      if(!response.ok) {
        console.error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch entries. Please try again!');
    }
  };

  async function handleDelete (id) {
    try {
      const response = await fetch (`http://localhost:8000/api/entries/${id}`, {
        credentials: 'include',
        method: 'DELETE'
    });

      if(!response.ok) {
        console.error('Failed to delete entry!');
      }

      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      alert('Entry deleted successfully!');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete entry. Please try again!');
    }
  };

  const  handleUpdate = (entryId) => {
   navigate(`/journal-entry/${entryId}`);
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Journal Entries
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg 
                       transform hover:-translate-y-0.5">
              Back to Home
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">Start your travel journey today!</p>
              <button 
                onClick={() => navigate('/journal-entry')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Create YourFirst Entry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry._id} 
                     className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{entry.title}</h2>
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
                  <div className="flex gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {entry.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose max-w-none">
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
  );
};

export default DisplayEntries;