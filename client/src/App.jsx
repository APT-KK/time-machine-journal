import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Entry from './pages/textEditor';
import MoodTracking from './pages/moodTracking';
import ChatBot from './pages/ChatBot';
import WordCloud from './pages/WordClouds';
import InteractiveMap from './pages/InteractiveMap';
import TimeTravelView from './pages/TimeTravelView';
import EntryView from './pages/EntryView';

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/journal-entry/:entryId?" element={<Entry />} />
        <Route path="/display-entries" element={<MoodTracking  />} />
        <Route path="/mood-tracking" element={<MoodTracking  />} />
        <Route path="/chat-bot" element={<ChatBot />}/>
        <Route path="/word-clouds" element={<WordCloud />}/>
        <Route path="/map" element={<InteractiveMap />} />
        <Route path="/time-travel-view" element={ <TimeTravelView />}/>
        <Route path="/entry/:entryId" element={<EntryView />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;