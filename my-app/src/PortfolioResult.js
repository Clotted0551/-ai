import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Container, Paper, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import portfolioData from './recession_portfolio_result.json';

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

export default function PortfolioResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { portfolioType, ageGroup } = location.state || {};

  if (!portfolioType || !ageGroup) {
    // 포트폴리오 타입이나 연령대가 없으면 포트폴리오 선택 페이지로 이동
    navigate('/PortfolioSelect');
    return null;
  }

  const portfolio = portfolioData['조정된 포트폴리오'][ageGroup][portfolioType];

  // 포트폴리오 데이터가 없는 경우 처리
  if (!portfolio) {
    return (
      <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <StyledPaper>
          <Typography variant="h4" gutterBottom>
            오류: 포트폴리오 데이터를 찾을 수 없습니다.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/PortfolioSelect')}>
            포트폴리오 선택으로 돌아가기
          </Button>
        </StyledPaper>
      </Container>
    );
  }

  const data = {
    labels: ['주식', '채권, 현금, 금'],
    datasets: [
      {
        label: '포트폴리오 비중',
        data: [portfolio['주식'], portfolio['채권, 현금, 금']],
        backgroundColor: ['#4caf50', '#ff9800'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          {ageGroup} - {portfolioType} 포트폴리오 결과
        </Typography>
        <Box sx={{ width: '60%', mb: 4 }}>
          <Doughnut data={data} />
        </Box>
        <Typography variant="h6" gutterBottom>
          주식: {portfolio['주식']}% <br />
          채권, 현금, 금: {portfolio['채권, 현금, 금']}%
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/PortfolioSelect')}>
            포트폴리오 선택으로 돌아가기
          </Button>
          <Button variant="contained" onClick={() => navigate('/')}>
            메인으로 돌아가기
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}