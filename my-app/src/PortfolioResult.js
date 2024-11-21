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
    navigate('/portfolio');
    return null;
  }

  const portfolio = portfolioData['조정된 포트폴리오'][ageGroup][portfolioType];

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
        <Button variant="outlined" onClick={() => navigate('/portfolio')}>
          돌아가기
        </Button>
      </StyledPaper>
    </Container>
  );
}
