import './App.css';

import { ChatProvider } from './context';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChatPage } from './pages/chat/Chat';
import { RegistrationPage } from './pages/auth/Registration';
import { useEffect } from 'react';
import {  setAccessToken } from './api/helpers';
import { Login } from './pages/auth/Login';
import AuthService from './api/authService';


function App() {
  useEffect(() => {
    const accessToken = AuthService.getAccessToken()
    if (accessToken) {
        setAccessToken(accessToken); 
    }
}, []); 
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/chat" />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}


export default App;
