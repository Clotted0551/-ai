import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { School, PlayArrow } from '@mui/icons-material';
import { ThemeContext } from './ThemeContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const MainButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
}));

function MainContent() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);

  const fetchUserData = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/Mypage');
    handleClose();
  }, [navigate]);

  const handleMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handlePlacementTest = useCallback(() => {
    navigate('/PlacementTest');
  }, [navigate]);

  const handleStartLearning = useCallback(() => {
    console.log('학습 시작');
  }, []);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              파인 에듀
            </Typography>
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
              <MenuItem onClick={handleProfileClick}>내 프로필</MenuItem>
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <StyledPaper elevation={3}>
            <Typography variant="h3" component="h1" gutterBottom color="text.primary">
              환영합니다, {user.userName}!
            </Typography>
            <Typography variant="h5" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
              학습할 준비가 되셨나요?
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      배치고사
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      자신의 현재 수준을 확인하고 맞춤형 학습 계획을 받아보세요.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <MainButton
                      variant="contained"
                      color="primary"
                      startIcon={<School />}
                      onClick={handlePlacementTest}
                      fullWidth
                    >
                      배치고사 시작
                    </MainButton>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      학습 시작
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      개인화된 학습 경험을 통해 실력을 향상시켜 보세요.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <MainButton
                      variant="contained"
                      color="secondary"
                      startIcon={<PlayArrow />}
                      onClick={handleStartLearning}
                      fullWidth
                    >
                      학습 시작하기
                    </MainButton>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </StyledPaper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default function Main() {
  const theme = useContext(ThemeContext);
  return (
    <ThemeProvider theme={theme}>
      <MainContent />
    </ThemeProvider>
  );
}