import React from 'react';
import TextEditor from '../components/TextEditor';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Entry = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <main>
      <Navbar isAuthenticated={isAuthenticated} isHomePage={false} />
      <TextEditor />
    </main>
  );
};

export default Entry;