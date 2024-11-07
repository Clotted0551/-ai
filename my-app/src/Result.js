import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';

const LevelDisplay = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

function Result() {
  const [userLevel, setUserLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const response = await fetch('/api/user/levelTest', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user level');
        }
        const data = await response.json();
        setUserLevel(data.userLevel);
      } catch (error) {
        console.error('Error fetching user level:', error);
        setUserLevel(1); // 에러 시 기본값 설정
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box my={4} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" component="h1" gutterBottom>
          배치고사 결과
        </Typography>
        <Fade in={true} timeout={1000}>
          <LevelDisplay elevation={3}>
            <Typography variant="h2" component="div" color="white">
              Level {userLevel}
            </Typography>
          </LevelDisplay>
        </Fade>
        <Box mt={4}>
          <Typography variant="body1" gutterBottom>
            축하합니다! 당신의 현재 레벨은 {userLevel}입니다.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            이 레벨에 맞는 학습 컨텐츠를 제공해 드리겠습니다.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleHomeClick}
          sx={{ mt: 4 }}
        >
          홈으로
        </Button>
      </Box>
    </Container>
  );
}

export default Result;