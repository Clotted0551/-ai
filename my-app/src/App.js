import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box, TextField, Button, Alert } from '@mui/material';
import { ThemeContext, theme } from './ThemeContext';

// Lazy load components
const Main = lazy(() => import('./Main'));
const MyPage = lazy(() => import('./Mypage'));
const PlacementTest = lazy(() => import('./PlacementTest'));
// 제거: const AuthForm = lazy(() => import('./AuthForm'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({ userId: '', userPassword: '' }); // Added state for user data

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async (event) => { // Modified handleLogin to accept event
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setSuccessMessage('로그인 성공!');
      } else {
        throw new Error('토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입 중 오류가 발생했습니다.');
      }

      setSuccessMessage('회원가입 성공! 로그인 화면으로 돌아갑니다.');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(event);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
            </Box>
          }>
            <Routes>
              <Route path="/" element={
                isLoggedIn ? <Navigate to="/Main" /> : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="userId"
                      label="사용자 ID"
                      name="userId"
                      autoComplete="username"
                      autoFocus
                      value={userData.userId}
                      onChange={(e) => setUserData({ ...userData, userId: e.target.value })}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="userPassword"
                      label="비밀번호"
                      type="password"
                      id="userPassword"
                      autoComplete="current-password"
                      value={userData.userPassword}
                      onChange={(e) => setUserData({ ...userData, userPassword: e.target.value })}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      로그인
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                  </Box>
                )
              } />
              <Route path="/Main" element={isLoggedIn ? <Main /> : <Navigate to="/" />} />
              <Route path="/Mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
              <Route path="/PlacementTest" element={isLoggedIn ? <PlacementTest /> : <Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;