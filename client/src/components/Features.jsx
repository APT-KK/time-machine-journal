import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Calendar, Cloud, Heart, BotMessageSquare  , NotebookText , NotebookPen } from 'lucide-react';

const Features = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Map className="w-12 h-12 text-primary" />,
      title: "Interactive Map",
      description: "Visualize your journey across India with location-based entries and memories.",
      path: '/interactive-map'
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: "Time Travel View",
      description: "Navigate through your past entries with an intuitive calendar interface.",
      path: '/time-travel-view'
    },
    {
      icon: <Cloud className="w-12 h-12 text-primary" />,
      title: "Word Clouds",
      description: "Discover patterns in your writing with beautiful word cloud visualizations.",
      path: '/word-clouds'
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Mood Tracking",
      description: "Track your mood and emotions and see how they evolve over time and places.",
      path: '/mood-tracking'
    },
    {
      icon: <BotMessageSquare className="w-12 h-12 text-primary" />,
      title: "Personalized AI Chat Bot",
      description: "Ask questions about your previous entries.",
      path: '/chat-bot'
    },
    {
      icon: < NotebookPen className="w-12 h-12 text-primary" />,
      title: "Journal Entry",
      description: "Write your journal entry.",
      path: '/journal-entry'
    },
    {
      icon: < NotebookText className="w-12 h-12 text-primary" />,
      title: "Display Entries",
      description: "Display your journal entries.",
      path: '/display-entries'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Dash-Board:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="animate-bounce-slow">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;