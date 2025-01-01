import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Strikethrough, Code, List, Quote, Link, Image, Heading, CheckSquare } from 'lucide-react';

const TextEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const handleSubmit = () => {
    setTitle('');
    setDescription('');
    console.log({ title, description });
    alert('Form submitted!');
  };

  return (
    <div className=" mx-auto p-4 font-sans min-h-screen bg-gradient-to-r from-[#0ED2F7] to-[#B2FEFA] ">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
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
              className="w-1/2 h-40 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter description..."
            />
            <div className="w-1/2 h-40 p-2 border border-gray-300 rounded-md bg-gray-50 overflow-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-yellow-300 text-black text-lg font-medium hover:bg-yellow-400 shadow"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
