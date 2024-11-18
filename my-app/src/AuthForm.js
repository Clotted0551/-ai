import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  CircularProgress 
} from '@mui/material';

function AuthForm({ setIsLoggedIn }) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userBirthday, setUserBirthday] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const url = showSignUp ? '/api/user/signup' : '/api/user/login';
    const userData = {
      userId,
      userNickname: showSignUp ? userNickname : undefined,
      userName: showSignUp ? userName : undefined,
      userPassword,
      userBirthday: showSignUp ? userBirthday : undefined,
      userEmail: showSignUp ? userEmail : undefined,
    };
    const body = showSignUp
      ? JSON.stringify(userData)
      : JSON.stringify({ userId, userPassword });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      if (showSignUp) {
        setSuccessMessage('회원가입 성공! 로그인 화면으로 돌아갑니다.');
        setTimeout(() => {
          setShowSignUp(false);
        }, 2000);
      } else {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
        } else {
          throw new Error('토큰이 응답에 포함되지 않았습니다.');
        }
      }
    } catch (error) {
      setError(error.message || '처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {showSignUp ? '회원가입' : '로그인'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userId"
            label="아이디"
            name="userId"
            autoComplete="username"
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          {showSignUp && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userNickname"
                label="닉네임"
                name="userNickname"
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="이름"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="userEmail"
                label="이메일"
                name="userEmail"
                autoComplete="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="userBirthday"
                label="생년월일 (YYYYMMDD)"
                name="userBirthday"
                value={userBirthday}
                onChange={(e) => setUserBirthday(e.target.value)}
                inputProps={{ maxLength: 8, pattern: "\\d{8}" }}
              />
            </>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="userPassword"
            label="비밀번호"
            type="password"
            id="userPassword"
            autoComplete="current-password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : (showSignUp ? '가입하기' : '로그인')}
          </Button>
          <Button
            fullWidth
            onClick={() => setShowSignUp(!showSignUp)}
          >
            {showSignUp ? '로그인으로 돌아가기' : '회원가입'}
          </Button>
        </Box>
      </Box>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success" align="center" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Container>
  );
}

export default AuthForm;