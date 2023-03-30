import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/auth/login/login';
import Signup from './components/auth/signup/signUp';
import NewsAggregator from './components/newsAggregator/NewsAggregator';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/news" element={<NewsAggregator onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
