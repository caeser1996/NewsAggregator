import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import SignUp from './components/auth/register';
import Dashboard from './components/dashboard/dashboard';
  
function App() {
  return (
    <Router>
      <div className="App">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
    </Router>
  )
}
export default App