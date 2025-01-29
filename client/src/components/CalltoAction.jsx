import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="bg-gradient-to-r from-[#FAD961] to-[#F76B1C] py-8 sm:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                    <div className="max-w-2xl mb-8 lg:mb-0">
                        <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                                     bg-clip-text text-transparent mb-4 sm:mb-6 leading-relaxed py-1">
                            Writing Insights
                        </h2>
                        <p className="text-base sm:text-xl mb-6 opacity-90 font-['Lucida Grande']">
                            Start chronicling your adventures and build a stunning collection of memories 
                            that you can cherish for a lifetime.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/journal-entry" 
                            className="px-6 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 
                                     text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 
                                     transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Create New Entry
                        </Link>
                        <Link 
                            to="/display-entries" 
                            className="px-6 py-3 text-center bg-white/90 text-gray-800 rounded-lg font-semibold 
                                     hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
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