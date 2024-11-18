// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Main from './Main';
import MyPage from './MyPage';
import PlacementTest from './PlacementTest';
import AuthForm from './AuthForm';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/Main" />
              ) : (
                <AuthForm setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/Main" element={isLoggedIn ? <Main /> : <Navigate to="/" />} />
          <Route path="/MyPage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
          <Route path="/PlacementTest" element={isLoggedIn ? <PlacementTest /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
