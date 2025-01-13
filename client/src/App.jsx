
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Entry from './pages/textEditor';
import MoodTracking from './pages/moodTracking';
import DisplayEntries from './pages/DisplayEntries';
import { AuthProvider } from './context/AuthContext';
import ChatBot from './pages/ChatBot';

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/journal-entry/:entryId?" element={<Entry />} />
        <Route path="/display-entries" element={<DisplayEntries />} />
        <Route path="/mood-tracking" element={<MoodTracking  />} />
        <Route path="/chat-bot" element={<ChatBot />}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;