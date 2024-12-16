// src/Main.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import TopBar from './components/TopBar';  // TopBar 컴포넌트 import
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  backgroundColor: '#fff',
  color: '#000',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const MainButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
  fontSize: '1.2rem',
  border: '2px solid #000',
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#000',
    color: '#fff',
  },
}));

export default function Main({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TopBar onLogout={handleLogout} /> {/* 상단바 컴포넌트 사용 */}
      <Container component="main" maxWidth="lg" sx={{ mt:10, mb: 5, px: { xs: 6, sm: 7, md: 8 } }}>
        <StyledPaper>
          <Typography variant="h2" component="h1" gutterBottom>
            환영합니다, {user.userName}!
          </Typography>
          <Typography variant="h4" gutterBottom>
            {user.userLevel === 0
              ? '배치고사를 진행해주세요!'
              : `현재 레벨: ${user.userLevel}`}
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mb: 6 }}>
            학습할 준비가 되셨나요?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <MainButton
              variant="outlined"
              onClick={() => navigate('/placement-test')}
              size="large"
            >
              배치고사
            </MainButton>
            <MainButton
              variant="outlined"
              onClick={() => navigate('/quiz')}
              size="large"
            >
              학습시작!
            </MainButton>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}
