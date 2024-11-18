import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Box,
  CircularProgress,
  Paper,
  Divider,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 600,
  margin: '0 auto',
}));

const MainButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 4),
}));

export default function Main() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '/';
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    window.location.href = '/myPage';
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePlacementTest = () => {
    window.location.href = '/PlacementTest';
  };

  const handleStartLearning = () => {
    window.location.href = '/Quiz';
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              파인 에듀
            </Typography>
            <Button color="inherit" href="/portfolio">
              나만의 포트폴리오 만들기!
            </Button>
            <div>
              <Button
                onClick={handleMenu}
                color="inherit"
                startIcon={
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.nickname.charAt(0)}
                  </Avatar>
                }
              >
                {user.nickname}
              </Button>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>{user.nickname}</MenuItem>
                <MenuItem disabled>{user.email}</MenuItem>
                <Divider />
                <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <StyledPaper elevation={3}>
            <Typography variant="h3" component="h1" gutterBottom>
              환영합니다, {user.userName}!
            </Typography>
            <Typography variant="h5" gutterBottom>
              {user.userLevel !== null 
                ? `현재 레벨: ${user.userLevel}`
                : "배치고사를 진행해 주세요!"}
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              학습할 준비가 되셨나요?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <MainButton variant="contained" color="primary" onClick={handlePlacementTest} size="large">
                배치고사
              </MainButton>
              <MainButton variant="contained" color="secondary" onClick={handleStartLearning} size="large">
                학습시작!
              </MainButton>
            </Box>
          </StyledPaper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}