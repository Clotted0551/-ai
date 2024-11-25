import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Main from './Main';
import MyPage from './Mypage';
import PlacementTest from './Placementtest';
import AuthForm from './AuthForm';
import Quiz from './Quiz'
import PortfolioSelect from './PortfolioSelect';
import PortfolioResult from './PortfolioResult';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/main" />
              ) : (
                <AuthForm setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route 
            path="/main" 
            element={isLoggedIn ? <Main setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/mypage" 
            element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/placement-test" 
            element={isLoggedIn ? <PlacementTest /> : <Navigate to="/" />} 
          />
          <Route 
            path="/quiz" 
            element={isLoggedIn ? <Quiz /> : <Navigate to="/" />} 
          />
          <Route path="/portfolio" element={<PortfolioSelect />} />
          <Route path="/portfolio-result" element={<PortfolioResult />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;