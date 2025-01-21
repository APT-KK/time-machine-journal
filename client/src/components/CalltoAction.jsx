import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="bg-gradient-to-r from-[#FAD961] to-[#F76B1C] py-16 text-white">
            <div className="container mx-auto max-w-6xl px-8 flex justify-between">
                <div className="max-w-2xl animate-fadeIn">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-[1.5] py-2">
                        Writing Insights
                    </h2>
                    <p className="text-xl mb-8 opacity-90 font-['Lucida Grande'] animate-slideUp">
                        Start chronicling your adventures and build a stunning collection of memories that you can cherish for a lifetime.
                        So grab your e-journal and immerse yourself in the beauty of the world while creating long-lasting memories.
                    </p>
                    <div className="flex gap-6">
                        <Link 
                            to="/journal-entry" 
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Create New Entry
                        </Link>
                        <Link 
                            to="/display-entries" 
                            className="px-8 py-3 bg-white/90 text-gray-800 rounded-lg font-semibold hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            View All Entries
                        </Link>
                    </div>
                </div>
           
            </div>
        </section>
    );
};

export default CallToAction;