import React , { useEffect, useState} from 'react';
import { Sparkles, Loader2, TrendingUp, Lightbulb, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const WordCloud = () => {
    const [ insights, setInsights ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect( () => {
        fetchInsights();
    }, [] );

    const fetchInsights = async () => {
        try {
          const response = await fetch(`${config.BASE_URL}/api/wordcloud/analysis`, {
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

      const getWordStyle = (value) => {
        const styles = [
          'bg-blue-100 text-blue-800 hover:bg-blue-200',
          'bg-purple-100 text-purple-800 hover:bg-purple-200',
          'bg-pink-100 text-pink-800 hover:bg-pink-200',
          'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
        ];
        return styles[Math.floor(Math.random() * styles.length)]; //randomly chooses a style
      };
      
      const getRareWordStyle = (value) => {
        if (value > 15) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        if (value > 10) return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
        if (value > 5) return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      };
      

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

      return (
        <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl mb-3 leading-relaxed font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Writing Insights
                  </h1>
                  <p className="text-gray-600 mt-2">Discover patterns and themes in your writing journey</p>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                           hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  Back to Home
                </button>
              </div>

              <div className="space-y-8">
                {/* Most Used Words Section */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Most Frequent Words
                  </h2>
                  <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
                    <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
                      {insights.most_used_words.map(({ text, value }) => (
                        <span
                          key={text}
                          className={`inline-block px-6 py-3 rounded-full cursor-default transition-all duration-300 
                          hover:scale-110 hover:shadow-md ${getWordStyle(value)}`}
                          style={{
                            fontSize: `${Math.max(1, Math.min(2.5, value / 10))}rem`,
                            opacity: Math.max(0.7, Math.min(1, value / 20))
                          }}
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Themes Section */}
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Writing Themes
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {insights.themes.map((theme) => (
                        <div
                          key={theme}
                          className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100 
                                   hover:border-yellow-300 transition-all duration-300 hover:shadow-md hover:scale-105"
                        >
                          <span className="text-gray-700 font-medium text-center block">{theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tone Section */}
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      Writing Tone
                    </h2>
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg 
                                hover:shadow-md transition-all duration-300 text-center">
                      <span className="text-2xl font-medium text-gray-700">{insights.tone}</span>
                    </div>
                  </div>
                </div>

                {/* Unique Words Section */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Unique Expressions
                  </h2>
                  <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-lg">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {insights.rare_words.map(({ text, value }) => (
                        <span
                          key={text}
                          className={`inline-block px-5 py-2.5 rounded-full cursor-default transition-all duration-300 
                          hover:scale-110 hover:shadow-md ${getRareWordStyle(value)}`}
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );



    
};

export default WordCloud;