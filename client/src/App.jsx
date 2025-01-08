
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Entry from './pages/textEditor';
import MoodTracking from './pages/moodTracking';
import DisplayEntries from './pages/DisplayEntries';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/journal-entry/:entryId?" element={<Entry />} />
        <Route path="/display-entries" element={<DisplayEntries />} />
        <Route path="/mood-tracking" element={<MoodTracking  />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;