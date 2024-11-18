import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Box, 
  Button, 
  Typography, 
  AppBar, 
  Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
}));

const MainButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
  fontSize: '1.2rem',
}));

export default function Main({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            파인 에듀
          </Typography>
          <Button color="inherit" onClick={() => navigate('/portfolio')}>
            나만의 포트폴리오 만들기
          </Button>
          <Button color="inherit" onClick={() => navigate('/mypage')}>
            마이페이지
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <StyledPaper>
          <Typography variant="h2" component="h1" gutterBottom>
            환영합니다, {user.userName}!
          </Typography>
          <Typography variant="h4" gutterBottom>
            {user.userLevel !== null
              ? `현재 레벨: ${user.userLevel}`
              : "배치고사를 진행해 주세요!"}
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mb: 6 }}>
            학습할 준비가 되셨나요?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <MainButton variant="contained" color="primary" onClick={() => navigate('/placement-test')} size="large">
              배치고사
            </MainButton>
            <MainButton variant="contained" color="secondary" onClick={() => navigate('/quiz')} size="large">
              학습시작!
            </MainButton>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}