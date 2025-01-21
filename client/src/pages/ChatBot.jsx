import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { Send, Trash2 } from 'lucide-react';
const PORT = 8000;

const ChatBot = () => {
    const [ chatHistory, setChatHistory ] = useState([]);
    const [ question, setQuestion ] = useState("");
    const [ generatingAnswer , setGeneratingAnswer ] = useState(false);
    const navigate = useNavigate();

    const chatHistoryContainer = useRef(null);

    //Auto-Scroll feature
    useEffect( () => {
        if(chatHistoryContainer.current) {
            chatHistoryContainer.current.scrollTop =chatHistoryContainer.current.scrollHeight;
        }
    }, [chatHistory, generatingAnswer]);

    //Locally saving the chat history (refresh-proof)
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

     //Locally saving the input question (refresh-proof)
    useEffect( () => {
        if(question.trim()){
            sessionStorage.setItem('question' , JSON.stringify(question));
        }
    }, [question]);

    // loading the chat history and question if reloads.
    useEffect(() => {
        const savedChatHistory = localStorage.getItem('chatHistory');
        if(savedChatHistory){
            setChatHistory(JSON.parse(savedChatHistory));
        } 
    
        const savedChatQuestion = sessionStorage.getItem('question');
        if(savedChatQuestion){
            setQuestion(JSON.parse(savedChatQuestion));
        }
    }, []);

    const handleNavigateHome = () => {
        sessionStorage.removeItem('question');
        navigate('/');
    };

    const clearHistory = () => {
        if(window.confirm('Are you sure you want to clear all the chat history?')){
            setChatHistory([]);
            localStorage.removeItem('chatHistory');
            sessionStorage.removeItem('question');
        }
    };
    
    // For the timeStamp of the messages
    const getCurrentTime = () => {
        const currentTime = new Date();
        return currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: "2-digit",
            hour12: true
        });
    };

    async function generateResponse (e) {
        e.preventDefault();

        if(!question.trim()){
            return;
        };

        setGeneratingAnswer(true);
        const currentQuestion = question;
        setQuestion("");
        sessionStorage.removeItem('question')

        setChatHistory(prevChatHistory => [...prevChatHistory, {
             type: 'question',
             content : currentQuestion,
             time: getCurrentTime()
        }]);

            try {
                const response = await fetch (`http://localhost:${PORT}/api/bot/question`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json ',
                    },
                    body: JSON.stringify({
                        question: currentQuestion
                    }),
                });

                if(!response.ok) {
                    console.error('Failed to fetch response!');
                }

                const data = await response.json();
                const BotResponse = data.response;

                setChatHistory(prevChatHistory => [...prevChatHistory, { 
                 type: 'answer',
                 content : BotResponse, 
                 time: getCurrentTime()
                }]);
        
            } catch (error) {
                console.error('Could not get the response', error);
                setChatHistory(prevChatHistory => [...prevChatHistory, {
                 type: 'answer', 
                 content: "Sorry!😭 Something went wrong. Please try again!", 
                 time: getCurrentTime()
                }])
            } finally {
                setGeneratingAnswer(false);
            }
    };

 return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Chat Assistant
              </h1>
              <p className="text-gray-600 mt-2">Chat with your personal journal insights assistant</p>
            </div>
            <button 
              onClick={handleNavigateHome}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold 
                       hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Back to Home
            </button>
          </div>

          {/* Chat Container */}
          <div 
            ref={chatHistoryContainer}
            className="bg-white rounded-xl shadow-lg p-6 mb-6 h-[500px] overflow-y-auto scrollbar-hide">
            
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 max-w-2xl shadow-md">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    Welcome to your personalised Chat-Bot!👋
                  </h2>
                  <p className="text-gray-600 mb-4">
                    I'm here to help you with anything you'd like to know about yourself through the lens of your entries!
                  </p>
                  <p className="text-gray-500 mt-6 text-sm">
                    Just type your question below and press Enter or click Send!
                    <br />
                    Note: The AI only uses the last 20 entries in order to fetch you a response.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                    <div 
                      className={`inline-block max-w-[80%] p-4 rounded-lg ${
                        chat.type === 'question'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <ReactMarkdown 
                        className="prose max-w-none" 
                        remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {chat.content}
                      </ReactMarkdown>
                      <p className={`text-sm mt-2 ${chat.type === 'question' ? 'text-gray-200' : 'text-gray-400'}`}>
                        {chat.time}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {generatingAnswer && (
              <div className="text-left">
                <div className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={generateResponse} className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex gap-4">
              <textarea
                required
                name="question"
                value={question}
                className="flex-1 border border-gray-200 rounded-lg p-3 focus:border-blue-400 focus:ring-1 
                         focus:ring-blue-400 resize-none bg-gray-50"
                rows="1"
                placeholder="Ask anything..."
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateResponse(e);
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={generatingAnswer}
                  className={`p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white
                           hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                           ${generatingAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  <Send className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 
                           transition-all duration-200 hover:shadow-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
 );

};

export default ChatBot;
