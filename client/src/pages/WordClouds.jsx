import React , { useEffect, useState} from 'react';
import { Cloud, BookOpen, PenTool, Sparkles, Loader2 } from 'lucide-react';

const WordCloud = () => {
    const [ insights, setInsights ] = useState(null);
    const [ activeTab, setActiveTab ] = useState('wordcloud');
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect( () => {
        fetchInsights();
    }, [] );

    const fetchInsights = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/wordcloud/analysis', {
           credentials: "include",
           method:'GET',
          });

          if(!response.ok){
            setError('Failed to fetch insights');    
         }

          const data = await response.json();
          setInsights(data);

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to generate insights. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    const getColorByValue = (value) => {
        const colors = [
          'bg-blue-100 hover:bg-blue-200',
          'bg-blue-200 hover:bg-blue-300',
          'bg-blue-300 hover:bg-blue-400',
          'bg-blue-400 hover:bg-blue-500',
          'bg-blue-500 hover:bg-blue-600',
          'bg-blue-600 hover:bg-blue-700'
        ];
        const index = Math.min(Math.floor((value / 10) * colors.length), colors.length - 1);
        return colors[index];
      };
    
      const getTextColor = (value) => {
        return value > 5 ? 'text-white' : 'text-gray-800';
      };
    
      const getFontSize = (value) => {
        const sizes = [
          'text-sm',
          'text-base',
          'text-lg',
          'text-xl',
          'text-2xl',
          'text-3xl'
        ];
        const index = Math.min(Math.floor((value / 10) * sizes.length), sizes.length - 1);
        return sizes[index];
      }

    if(error){
        return(
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
               onClick={fetchInsights}
                className="
                    block
                    px-8 py-3 
                    m-2.5
                    text-center
                    text-white
                    rounded-lg
                    transition-all duration-500
                    bg-gradient-to-r from-[#2BC0E4] via-[#EAECC6] to-[#2BC0E4]
                    bg-[length:200%_auto]
                    shadow-[0_0_20px_#eee]
                    hover:bg-[position:right_center]">
                  Try Again
                </button>
          </div>
        );
    };

    if (!insights) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <p className="text-gray-700 mb-4">No entries found. Start writing to see your insights!</p>
          </div>
        );
      };

     if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Analyzing your journal entries...</p>
          </div>
        );
      }

      const tabContent = {
        wordcloud: (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Most Used Words</h2>
            <div className="flex flex-wrap gap-3 justify-center p-8 bg-gray-50 rounded-lg">
              {insights.most_used_words.map(({ text, value }) => (
                <span
                  key={text}
                  className={`inline-block px-4 py-2 rounded-full cursor-default transition-all duration-300 
                  hover:scale-110 ${getColorByValue(value)} ${getTextColor(value)} ${getFontSize(value)}`}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        ),
        themes: (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Writing Themes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {insights.themes.map((theme) => (
                <div
                  key={theme}
                  className="p-4 bg-gray-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  {theme}
                </div>
              ))}
            </div>
          </div>
        ),
        tone: (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Writing Tone</h2>
            <div className="p-6 bg-gray-50 rounded-lg text-center text-xl font-medium text-gray-700">
              {insights.tone}
            </div>
          </div>
        ),
        rare: (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Unique Words</h2>
            <div className="flex flex-wrap gap-3 justify-center p-8 bg-gray-50 rounded-lg">
              {insights.rare_words.map(({ text, value }) => (
                <span
                  key={text}
                  className={`inline-block px-4 py-2 rounded-full cursor-default transition-all duration-300 
                  hover:scale-110 ${getColorByValue(value)} ${getTextColor(value)} ${getFontSize(value)}`}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        )
      };

      return (
        <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C]  p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Journal Insights :-</h1>
            
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('wordcloud')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'wordcloud' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Cloud className="w-4 h-4" />
                Word Cloud
              </button>
              <button
                onClick={() => setActiveTab('themes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'themes' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Themes
              </button>
              <button
                onClick={() => setActiveTab('tone')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'tone' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PenTool className="w-4 h-4" />
                Writing Tone
              </button>
              <button
                onClick={() => setActiveTab('rare')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'rare' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Unique Words
              </button>
            </div>
    
            <div className="transition-opacity duration-200">
              {tabContent[activeTab]}
            </div>
          </div>
        </div>
      );



    
};

export default WordCloud;