import React from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Calendar, Lock } from 'lucide-react'; 

const Default = () => {
    return (
        <div className="w-full">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    
                    <p className="text-xl text-gray-600 mb-8">
                        Capture your journey through time, one entry at a time
                    </p>
                    
                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <PenLine className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Markdown based Text Editor</h3>
                            <p className="text-gray-600">Express yourself with markdown formatting, lists, quotes and more</p>
                        </div>
                        
                        <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Daily Reflections</h3>
                            <p className="text-gray-600">Chronicle your daily thoughts and memories with dated entries</p>
                        </div>
                        
                        <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <Lock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
                            <p className="text-gray-600">Your personal thoughts stay private and protected</p>
                        </div>
                    </div>

                    <div className="mt-16 bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                        <div className="text-left">
                            <div className="text-sm text-gray-500 mb-2">Sample Entry</div>
                            <div className="text-lg font-semibold mb-3">Dear Time Machine Journal...</div>
                            <div className="mt-4 text-sm text-gray-500 mb-2">December 25, 2024</div>
                            <div className="text-gray-700 prose">
                                <p className="mb-4">
                                    Today marks the <strong>beginning of my journey</strong>. With this journal, 
                                    I'll be able to look back and see <em>how far I've come</em>. 
                                </p>

                                <p className="mb-4">My goals for this journal:</p>
                                <ul className="list-disc pl-6 mb-4">
                                    <li>📝 Document daily reflections</li>
                                    <li>💭 Capture meaningful moments</li>
                                    <li>🎯 Track personal growth</li>
                                </ul>

                                <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4">
                                    "Every entry is a snapshot of my thoughts, preserved in time..."
                                </blockquote>

                                <p>
                                    Current mood: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Excited ✨</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center gap-4">
                        <Link 
                            to="/signup" 
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Start Your Journal
                        </Link>
                        <Link 
                            to="/login" 
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Default;