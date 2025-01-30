# Time Machine Journal 🚀

A modern, feature-rich journaling application that helps you chronicle your life's journey with style and intelligence.

<br/>

## ✨ Features

### 📝 Rich Text Editing
- Markdown support with live preview
- Support for lists, quotes, and formatting
- Clean and intuitive interface

<br/>

### 🎨 Visual Experience
- Beautiful gradient backgrounds
- Smooth transitions and animations
- Responsive design for all devices
- Modern glassmorphism UI elements

<br/>

### 📊 Smart Features
- **Mood Tracking**: Track your emotional journey with color-coded entries
- **Interactive Map**: Visualize your journey across locations
- **Time Travel View**: Navigate through past entries with calendar interface
- **Word Clouds**: Discover patterns in your writing
- **AI Chat Bot**: Interact with your journal entries intelligently

<br/>

### 🔐 User Experience
- Secure authentication system
- Personalized dashboard
- Intuitive navigation
- Real-time updates

<br/>

## 🎯 Technical Stack

### Frontend
- **React** with Vite for blazing fast development
- **Tailwind CSS** for modern styling
  - Custom gradients
  - Responsive design
  - Glassmorphism effects
- **Libraries**
  - `react-markdown` for MD rendering
  - `react-leaflet` for maps
  - `lucide-react` for beautiful icons
  - `react-calendar` for date navigation

<br/>

### Backend
- **Node.js** server
- **MongoDB** database
- **Groq API** integration for AI features
- RESTful API architecture

<br/>

## 🚀 Key Components

### Pages
- `Home`: Landing page with feature showcase
- `JournalEntry`: Rich text editor for new entries
- `DisplayEntries`: Grid view of all journal entries
- `MoodTracking`: Emotional journey visualization
- `WordClouds`: Text analysis and patterns
- `ChatBot`: AI-powered journal interaction
- `EntryView`: Detailed view of individual entries

<br/>

### Features
- **Authentication Context**: Global auth state management
- **Responsive Layout**: Adapts to all screen sizes
- **Error Handling**: Graceful error management
- **Loading States**: Smooth loading transitions

<br/>

## 🎨 Design System

### Color Palette

```
const moodColors = {
    Happy: { base: '#4CAF50', light: '#E8F5E9' },
    Sad: { base: '#2196F3', light: '#E3F2FD' },
    Excited: { base: '#FFC107', light: '#FFF8E1' },
    Anxious: { base: '#F44336', light: '#FFEBEE' },
    Calm: { base: '#9C27B0', light: '#F3E5F5' },
    Neutral: { base: '#9E9E9E', light: '#F5F5F5' }
};
```

### Gradients
- Primary: from-[#FAD961] to-[#F76B1C]
- Accent: from-blue-600 to-purple-600
- Background: from-gray-50 to-gray-100

## 🛠️ Setup & Installation
- Clone the repository
- Install dependencies:
  ```
   cd client && npm install
  cd ../server && npm install
   
- Set up environment variables:
  ```
  VITE_BASE_URL=http://localhost:8000
  VITE_TILE_LAYER_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  
- Run development servers:
  ```
  # Frontend
  npm run dev

  # Backend
  npm start 
 

## 🔥 Performance Features
- Lazy loading of components
- Optimized image loading
- Efficient state management
- Responsive design
- Smart caching strategies

## 🎨 Design Features
- Modern glassmorphism UI
- Responsive layouts
- Beautiful gradients
- Smooth animations
- Intuitive navigation

## 📄 License
This project is licensed under the MIT License.

Built with ❤️ by Kabeer Khosla with the guidance of my mentors under SDS Labs.








