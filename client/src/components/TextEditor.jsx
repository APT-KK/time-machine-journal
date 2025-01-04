import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Strikethrough, Code, List, Quote, Link, Image, Heading, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TextEditor = ( { addEntry } ) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const applyMarkdown = (startTag, endTag = startTag) => {
    const textarea = document.getElementById('description');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = description.substring(0, start);
    const selectedText = description.substring(start, end);
    const after = description.substring(end);

    const newContent = `${before}${startTag}${selectedText}${endTag}${after}`;
    setDescription(newContent);
  };

  const handleSubmit = async () => {
   try {
      const response = await fetch("http://localhost:8000/api/entries", {
        method : "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title , location , date , description}),
      });

      if (!response.ok) {
        throw new Error ('Failed to save the entry');
      }

      const result = await response.json();
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('`', '`')}><Code size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('- ')}><List size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('> ')}><Quote size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('[', '](url)')}><Link size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('![', '](image_url)')}><Image size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('# ', '')}><Heading size={18} /></button>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 border text-gray-800" onClick={() => applyMarkdown('- [ ] ', '')}><CheckSquare size={18} /></button>
          </div>
          <div className="flex space-x-4">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
