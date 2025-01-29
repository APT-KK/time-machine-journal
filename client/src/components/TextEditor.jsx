import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Strikethrough, List, Quote, Link, Image, Heading, Square, CheckSquare, Code, Heading1, Heading2, Heading3, ListOrdered, Minus, Code2, Underline } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ROUTES } from '../config/config';

const TextEditor = () => {
  
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [error, setError] = useState('');

  const getDefaultLocation = async () => {

    if (!entryId && 'geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        
        // Reverse geo-coding through Nominatim(limited to india currently)
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=in`,
          
          { headers: { 'User-Agent': 'WOC-Journal' } }
        );

        if (!nominatimResponse.ok) {
          throw new Error('Failed to get location from Nominatim');
        }

        const nominatimData = await nominatimResponse.json();
        
        const locationName = nominatimData.address.city    || 
                             nominatimData.address.town    || 
                             nominatimData.address.village || 
                             nominatimData.address.suburb;

        if (locationName) {
          setFormData(prev => ({ ...prev, location: locationName }));
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
  };

  useEffect(() => {
    if (!entryId) {
      getDefaultLocation();
    }
  }, []);

  const [formData , setFormData] = useState( () => {
    const savedData = localStorage.getItem(`draft-${entryId || 'new' }`);
    if(savedData){
      return JSON.parse(savedData);
    }
    return {
      title: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      mood: ''
    };

  });
  
  const { title, location, date, description } = formData;

  useEffect( () => {
    const draftKey = `draft-${entryId || 'new'}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
  }, [formData, entryId]);

  useEffect(() => {
    if(entryId){
      fetchEntry();
    }
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      const response = await fetch (API_ROUTES.ENTRY(entryId), {
        credentials: 'include',
        method: 'GET',
      });

      if(!response.ok){
        console.error('Failed to fetch entry!');
      }

      const { entry } = await response.json();

      const entryData = {
        title: entry.title, 
        location: entry.location, 
        date: new Date(entry.date).toISOString().split('T')[0],
        description: entry.content,
      }

      setFormData(entryData);
      localStorage.setItem(`draft-${entryId}`, JSON.stringify(entryData));

    } catch (error) {
      console.error('Error fetching entry:', error);
      alert('Failed to fetch entry details');
      navigate('/display-entries');
    }
  }

  const handleInputChange = (e) => {
    const {name , value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyMarkdown = (startTag, endTag = startTag) => {
    try {
      const textarea = document.getElementById('editor-textarea');
      if (!textarea) {
        console.error('Textarea element not found');
        return;
      }
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = description.substring(0, start);
      const selectedText = description.substring(start, end).trim();
      const after = description.substring(end);
      
      const spaceAfter = after.startsWith(' ') ? '' : ' ';
      const newContent = `${before}${startTag}${selectedText}${endTag}${spaceAfter}${after}`;
      
      setFormData(prev => ({
        ...prev,
        description: newContent
      }));

    } catch (error) {
      console.error('Error applying markdown:', error);
    }
  };

  const ToolbarButton = ({ icon, onClick, tooltip }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
      title={tooltip}
    >
      {icon}
    </button>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.title.trim()) {
        alert('Please fill in the title before saving.');
        return;
      }
      
      if (!formData.description.trim()) {
        alert('Please fill in the description before saving.');
        return;
      }

      const url = entryId 
        ? API_ROUTES.ENTRY(entryId)
        : API_ROUTES.ENTRIES;

      const method = entryId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save the entry');
      }

      localStorage.removeItem(`draft-${entryId || 'new'}`);
      navigate('/display-entries');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save the entry. Please try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              { entryId ? (
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Journal Entry
              </h1>
              ) : (
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New Journal Entry
              </h1>
              )}

              <p className="text-gray-600 mt-2">Express your thoughts and memories</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="group">
              <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                         focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200
                         group-hover:border-gray-400"
                placeholder="Give your entry a meaningful title..."
                required
              />
            </div>

            {/* Location Input */}
            <div className="group">
              <label className="block text-lg font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                         focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200
                         group-hover:border-gray-400"
                placeholder="Where are you writing from?"
                required
              />
            </div>

            {/* Date Input */}
            <div className="group flex items-center gap-4">
              <label className="text-lg font-medium text-gray-700 min-w-[60px]">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-48 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                         focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200
                         group-hover:border-gray-400"
                required
              />
            </div>
            
            {/* Content Editor */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Content</label>
              <div className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200">
                {/* Markdown Toolbar */}
                <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  {/* Text Formatting */}
                  <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton icon={<Bold size={18} />} onClick={() => applyMarkdown('**', '**')} tooltip="Bold" />
                    <ToolbarButton icon={<Italic size={18} />} onClick={() => applyMarkdown('_', '_')} tooltip="Italic" />
                    <ToolbarButton icon={<Strikethrough size={18} />} onClick={() => applyMarkdown('~~', '~~')} tooltip="Strikethrough" />
                    <ToolbarButton icon={<Code size={18} />} onClick={() => applyMarkdown('`', '`')} tooltip="Inline Code" />
                  </div>

                  {/* Headers */}
                  <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton icon={<Heading1 size={18} />} onClick={() => applyMarkdown('# ', '')} tooltip="Heading 1" />
                    <ToolbarButton icon={<Heading2 size={18} />} onClick={() => applyMarkdown('## ', '')} tooltip="Heading 2" />
                    <ToolbarButton icon={<Heading3 size={18} />} onClick={() => applyMarkdown('### ', '')} tooltip="Heading 3" />
                  </div>

                  {/* Lists */}
                  <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton icon={<List size={18} />} onClick={() => applyMarkdown('- ', '')} tooltip="Bullet List" />
                    <ToolbarButton icon={<ListOrdered size={18} />} onClick={() => applyMarkdown('1. ', '')} tooltip="Numbered List" />
                    <ToolbarButton icon={<CheckSquare size={18} />} onClick={() => applyMarkdown('- [x] ', '')} tooltip="Task List (Checked)" />
                    <ToolbarButton icon={<Square size={18} />} onClick={() => applyMarkdown('- [ ] ', '')} tooltip="Task List (Unchecked)" />
                  </div>

                  {/* Block Elements */}
                  <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                    <ToolbarButton icon={<Quote size={18} />} onClick={() => applyMarkdown('> ', '')} tooltip="Blockquote" />
                    <ToolbarButton icon={<Minus size={18} />} onClick={() => applyMarkdown('---\n', '')} tooltip="Horizontal Rule" />
                    <ToolbarButton icon={<Code2 size={18} />} onClick={() => applyMarkdown('```\n', '\n```')} tooltip="Code Block" />
                  </div>

                  {/* Media */}
                  <div className="flex items-center gap-1">
                    <ToolbarButton icon={<Image size={18} />} onClick={() => applyMarkdown('![', '](image_url)')} tooltip="Add Image" />
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  id="editor-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-4 min-h-[400px] rounded-b-lg focus:outline-none focus:ring-0"
                  placeholder="Start writing your thoughts..."
                  required
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4 break-words">Preview</h3>
              <div className="prose max-w-none break-words">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {formData.description || '*Your formatted text will appear here...*'}
                </ReactMarkdown>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold 
                         hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                         font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 
                         shadow-md hover:shadow-lg"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
