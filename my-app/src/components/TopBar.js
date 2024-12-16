// src/components/TopBar.js
import React from 'react';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#4169E1',
  color: '#fff',
}));

const TopBar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          파인 에듀
        </Typography>
        <Button color="inherit" onClick={() => navigate('/page')}>
          나만의 포트폴리오 만들기
        </Button>
        <Button color="inherit" onClick={() => navigate('/mypage')}>
          마이페이지
        </Button>
        <Button color="inherit" onClick={onLogout}>
          로그아웃
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;
