import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Calendar, Cloud, Heart, BotMessageSquare} from 'lucide-react';

const Features = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Map className="feature-icon" />,
      title: "Interactive Map",
      description: "Visualize your journey across India with location-based entries and memories.",
      path: '/interactive-map'
    },
    {
      icon: <Calendar className="feature-icon" />,
      title: "Time Travel View",
      description: "Navigate through your past entries with an intuitive calendar interface.",
      path: '/time-travel-view'
    },
    {
      icon: <Cloud className="feature-icon" />,
      title: "Word Clouds",
      description: "Discover patterns in your writing with beautiful word cloud visualizations.",
      path: '/word-clouds'
    },
    
    {
      icon: <Heart className="feature-icon" />,
      title: "Mood Tracking",
      description: "Track your mood and emotions and see how they evolve over time and places.",
      path: '/mood-tracking'
    },
    {
      icon: <BotMessageSquare className="feature-icon" />,
      title: "Personalized AI Chat Bot",
      description: "Ask questions about your previous entries.",
      path: '/chat-bot'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Dash-Board:</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card"
            onClick={() =>  navigate(feature.path)} 
            style={{ cursor: 'hand' }}>
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;