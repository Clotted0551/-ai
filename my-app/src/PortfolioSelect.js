import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Button,
  Typography,
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

export default function PortfolioSelect() {
  const navigate = useNavigate();
  const [portfolioType, setPortfolioType] = useState(null);
  const [ageGroup, setAgeGroup] = useState(null);

  const handleConfirm = () => {
    if (portfolioType && ageGroup) {
      navigate('/portfolio-result', { state: { portfolioType, ageGroup } });
    } else {
      alert('모든 항목을 선택해 주세요!');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          포트폴리오 선택
        </Typography>
        <Typography variant="h6" gutterBottom>
          1. 투자 성향을 선택하세요:
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <MainButton onClick={() => setPortfolioType('공격적')}>
            공격적
          </MainButton>
          <MainButton onClick={() => setPortfolioType('수비적')}>
            수비적
          </MainButton>
        </Box>
        <Typography variant="h6" gutterBottom>
          2. 연령대를 선택하세요:
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <MainButton onClick={() => setAgeGroup('청년층')}>청년층</MainButton>
          <MainButton onClick={() => setAgeGroup('중년층')}>중년층</MainButton>
          <MainButton onClick={() => setAgeGroup('장년층')}>장년층</MainButton>
        </Box>
        <MainButton
          variant="outlined"
          onClick={handleConfirm}
          size="large"
        >
          확인
        </MainButton>
      </StyledPaper>
    </Container>
  );
}
