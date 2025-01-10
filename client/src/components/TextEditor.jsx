import React, { useState , useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Strikethrough, List, Quote, Link, Image, Heading, Square, CheckSquare } from 'lucide-react';
import { useNavigate , useParams } from 'react-router-dom';

const TextEditor = () => {
  
  const navigate = useNavigate();
  const { entryId } = useParams();
  
  const [formData , setFormData] = useState( () => {
    const savedData = localStorage.getItem(`draft-${entryId || 'new' }`);
    if(savedData){
      return JSON.parse(savedData);
    }
    return {
      title: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
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
      const response = await fetch (`http://localhost:8000/api/entries/${entryId}`, {
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
        description: entry.content 
      }

      setFormData(entryData);
      localStorage.setItem(`draft-${entryId}`, JSON.stringify(entryData));

    } catch (error) {
      console.error('Error fetching entry:', error);
      alert('Failed to fetch entry details');
      navigate('/display-entries');
    }
  }
  const defaultLocation = () => {
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              location: `Lat: ${latitude}, Long: ${longitude}`
            }));
          },         
          (error) => {
            console.error("Error fetching location: ", error);
            setFormData((prev) => ({
              ...prev,
              location: 'Unable to fetch location'
            }));         
           }
        );
      } else {
        setFormData((prev) => ({
          ...prev,
          location: 'Geolocation is not supported by this browser.'
        }));     
       }
    } , []);
  
  };

  defaultLocation();

  const handleInputChange = (e) => {
    const {name , value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyMarkdown = (startTag, endTag = startTag) => {
    const textarea = document.getElementById('description');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = description.substring(0, start);
    const selectedText = description.substring(start, end);
    const after = description.substring(end);

    const newContent = `${before}${startTag}${selectedText}${endTag}${after}`;
    setFormData(prev => ({
      ...prev,
      description: newContent
    }));
  };


  const handleSubmit = async () => {
   try {
    if (!formData.title.trim()) {
      alert('Please fill in the title before saving.');
      return;
    };
    
    if (!formData.description.trim()) {
      alert('Please fill in the description before saving.');
      return;
    }
      const url = entryId ? `http://localhost:8000/api/entries/${entryId}` 
      : 'http://localhost:8000/api/entries';

      const method = entryId ? 'PUT' : 'POST';

      const response = await fetch (url, {
        method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( formData ),
      });

      if (!response.ok) {
        console.error('Failed to save the entry');
      }

      localStorage.removeItem(`draft-${entryId || 'new'}`);
      navigate('/display-entries');

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to save the entry . Please try again!');
  }
};
  return (
    <div className=" mx-auto p-4 font-sans min-h-screen bg-gradient-to-r from-[#0ED2F7] to-[#B2FEFA] ">
     <div className="max-w-[80vw] mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2 p-2">
            Title :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Enter title..."
          />
        </div>
        <div className="mb-6">
          <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2 p-2">
            Location :
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Enter title..."
          />
        </div>
        <div className="mb-6 p-2 ">
          <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">
            Date :
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date || ""}
            onChange={handleInputChange}
            className="block  border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-6 p-2">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Description :
            </label>
          <br /> 
          <div className="flex items-center space-x-2 mb-4">
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('**', '**')}><Bold size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('_', '_')}><Italic size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('~~', '~~')}><Strikethrough size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('- ')}><List size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('> ')}><Quote size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('[', '](url)')}><Link size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('![', '](image_url)')}><Image size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('# ', '')}><Heading size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('- [x] ', '')}><CheckSquare size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('- [ ] ', '')}><Square size={18} /></button>

          </div>
          <div className="flex space-x-4">
            <textarea
              id="description"
              value={formData.description || ""}
              name="description"
              onChange={handleInputChange}
              className="w-1/2 h-[40vh] p-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter the description..."
            />
            <div className="w-1/2 h-[40vh] border-gray-300 rounded-md shadow-sm bg-gray-100 p-4"
            >
               <ReactMarkdown className="prose" remarkPlugins={[remarkGfm, remarkBreaks , remarkFrontmatter]}
                rehypePlugins={[rehypeRaw]} components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-2" {...props}/>,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold my-2" {...props}/>,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props}/>,
                  p: ({node, ...props}) => <p className="my-2" {...props}/>,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props}/>,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props}/>,
                  li: ({node, ...props}) => <li className="my-1" {...props} /> ,
                  blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #ccc', paddingLeft: '1em', margin: '1em 0', color: '#555', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px'}}>{children}</blockquote>
                }}>{description}</ReactMarkdown> 
            </div>
          </div>
        </div>

        <div className="flex justify-end"> 
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-yellow-300 text-black text-lg font-medium hover:bg-yellow-400 shadow"
          >
            Save Entry
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
