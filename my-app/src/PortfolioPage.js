import React, { useState, useEffect } from 'react';
import { Button, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { Face, Group, Elderly } from '@mui/icons-material';
import data from '../results/recession_portfolio_result.json';

const PortfolioPage = () => {
  const [step, setStep] = useState(0);
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);  // 포트폴리오 데이터 상태

  // 초기 디버깅: 상태 출력
  useEffect(() => {
    console.log(`step: ${step}, selectedAge: ${selectedAge}, selectedStrategy: ${selectedStrategy}, loading: ${loading}`);
  }, [step, selectedAge, selectedStrategy, loading]);

  const handleStart = () => setStep(1);

  const handleAgeSelect = (age) => {
    console.log(`선택된 연령대: ${age}`); // 디버깅
    setSelectedAge(age);
    setStep(2); // 연령대 선택 후 단계 이동
  };

  const handleStrategySelect = (strategy) => {
    console.log(`선택된 투자 성향: ${strategy}`); // 디버깅
    setSelectedStrategy(strategy);
    setLoading(true);

    // 포트폴리오 데이터를 가져오는 로직
    setTimeout(() => {
      setPortfolio(data['조정된 포트폴리오'][selectedAge][selectedStrategy]); // 캐싱된 데이터 설정
      setLoading(false);
      setStep(3); // 5초 후에 결과 화면으로 이동
    }, 5000); // 5초 대기
  };

  const renderDots = () => {
    const [dots, setDots] = useState('.');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <Typography>{`경기침체 확률을 예측 중입니다${dots}`}</Typography>;
  };

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      {step === 0 && (
        <>
          <Typography variant="h4" gutterBottom>
            침체확률로 만든 나만의 포트폴리오 만들기!
          </Typography>
          <Button variant="contained" onClick={handleStart}>
            시작하기
          </Button>
        </>
      )}
      {step === 1 && (
        <>
          <Typography variant="h6">연령대를 선택하세요</Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { label: '청년층', icon: <Face />, value: '청년층' },
              { label: '중년층', icon: <Group />, value: '중년층' },
              { label: '장년층', icon: <Elderly />, value: '장년층' },
            ].map(({ label, icon, value }) => (
              <Grid item key={value}>
                <Button
                  variant="outlined"
                  startIcon={icon}
                  onClick={() => handleAgeSelect(value)} // 연령대 선택 처리
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {step === 2 && (
        <>
          <Typography variant="h6">{`${selectedAge}을(를) 선택했습니다. 투자 성향을 선택하세요:`}</Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { label: '공격적', value: '공격적' },
              { label: '수비적', value: '수비적' },
            ].map(({ label, value }) => (
              <Grid item key={value}>
                <Button variant="contained" onClick={() => handleStrategySelect(value)}>
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {step === 3 && (
        <>
          {loading ? (
            <>
              <CircularProgress />
              {renderDots()}
            </>
          ) : (
            <>
              <Typography variant="h6">{`경기침체 확률: ${data['경기침체 확률']}%`}</Typography>

              <Typography variant="h6">
                {`포트폴리오: 주식 ${portfolio.주식}%, 채권, 현금, 금 ${portfolio['채권, 현금, 금']}%`}
              </Typography>
              <Button variant="contained" onClick={() => setStep(0)}>
                메인으로 돌아가기
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default PortfolioPage;
