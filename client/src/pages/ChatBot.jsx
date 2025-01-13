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
    <div className=" mx-auto p-4 font-sans min-h-screen bg-gradient-to-r from-[#434343] to-black">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
         <header className="text-center flex flex-rows justify-between py-4">
           <h1 className="text-4xl font-bold text-gray-400">
             Journal Entry ChatBot :-
           </h1>
           <button 
               onClick={handleNavigateHome}
                className="
                    block
                    px-8 py-3
                    m-2.5
                    text-center
                    text-black
                    font-bold
                    rounded-lg
                    transition-all duration-500
                    btn-grad bg-gradient-to-r from-gray-200 via-white       
                    bg-[length:200%_auto]
                    shadow-[0_0_15px_#eee]
                    hover:bg-[position:right_center]">
                  Back to Home
                </button>
         </header>

    <div
     ref={chatHistoryContainer}
     className="h-[500px] overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4 scrollbar-hide">
        
      {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-blue-50 rounded-xl p-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Welcome to your personalised Chat-Bot!👋</h2>
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
            {chatHistory.map((chat,index) => (
                <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto scrollbar-hide
                        ${ chat.type === 'question' ?
                            'bg-blue-500 text-gray-600 rounded-br-none' :
                            'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                        <ReactMarkdown className=" prose overflow-auto scrollbar-hide" remarkPlugins={[remarkGfm, remarkBreaks , remarkFrontmatter]}
                            rehypePlugins={[rehypeRaw]} components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-2" {...props}/>,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold my-2" {...props}/>,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props}/>,
                                p: ({node, ...props}) => <p className="my-2" {...props}/>,
                                ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props}/>,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props}/>,
                                li: ({node, ...props}) => <li className="my-1" {...props} /> ,
                                blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #ccc', paddingLeft: '1em', margin: '1em 0', color: '#555', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px'}}>{children}</blockquote>
                            }}>
                           {chat.content}
                        </ReactMarkdown>

                        <p className='text-gray-400'>
                            {chat.time}
                        </p>
                            
                    </div>
                </div>
            ))}
            </>
          )}
          {generatingAnswer && (
            <div className='text-left'>
             <div className="loader w-14 aspect-[2] bg-custom-gradient bg-no-repeat bg-[length:calc(100%/3)_50%] animate-l3">
             </div>
            </div>
          )}
        </div>

        <form onSubmit={generateResponse} className='bg-white rounded-lg shadow-lg p-4'>
         <div className='flex gap-2'>
            <textarea required 
             name="question"
             value={question}
             className="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none" 
             rows="2"
             placeholder="Ask anything...."
             onChange={(e) => setQuestion(e.target.value)}
             onKeyDown={ (e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateResponse(e);
                }
             }} />
             <button type='submit'
                    disabled={generatingAnswer}
                    className={`${ generatingAnswer ? 'opacity-50 cursor-not-allowed' : '' }`}>
                <Send />
             </button>
             <button onClick={clearHistory}>
                <Trash2 />
             </button>

         </div>
        </form>
    </div>
    </div>
 );

};

export default ChatBot;
