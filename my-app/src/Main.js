import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from './components/TopBar'; // TopBar 컴포넌트 import
import AssessmentIcon from '@mui/icons-material/Assessment'; // 아이콘 예시
import SchoolIcon from '@mui/icons-material/School';
// 스타일링: 큰 박스
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(5),
  borderRadius: '16px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#F9F9F9',
  minHeight: '220px',
  width: '100%',
  textAlign: 'center',
}));
// 버튼 스타일
const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
}));
export default function Main({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      <TopBar onLogout={handleLogout} />
      <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          경제 교육 학습 플랫폼
        </Typography>
        <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
          {/* 배치고사 박스 */}
          <StyledPaper>
            <AssessmentIcon sx={{ fontSize: 60, color: '#4CAF50' }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              배치고사
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#555' }}>
              나의 경제지식을 측정하고 맞춤 학습을 시작하세요.
            </Typography>
            <ActionButton onClick={() => navigate('/placement-test')}>시작하기</ActionButton>
          </StyledPaper>
          {/* 문제풀기 박스 */}
          <StyledPaper>
            <SchoolIcon sx={{ fontSize: 60, color: '#FF9800' }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              문제풀기
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#555' }}>
              다양한 경제 문제를 해결하며 실력을 키우세요.
            </Typography>
            <ActionButton onClick={() => navigate('/quiz')}>학습 시작</ActionButton>
          </StyledPaper>
        </Box>
      </Container>
    </Box>
  );
}