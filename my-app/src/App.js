import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard'; // Dashboard 컴포넌트 가져오기

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const url = showSignUp ? '/api/user/signup' : '/api/user/login';

    const userData = {
      userId: userId,
      userNickname: userNickname,
      userName: userName,
      userPassword: userPassword,
      userBirthday: userBirthday,
      userEmail: userEmail,
    };

    const body = showSignUp
      ? JSON.stringify(userData)
      : JSON.stringify({ userId: userId, userPassword: userPassword });


    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // JSON 파싱 실패 시 빈 객체 반환
        throw new Error(errorData.message || '서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      if (showSignUp) {
        setSuccessMessage('회원가입 성공! 로그인 화면으로 돌아갑니다.');
        setTimeout(() => {
            setShowSignUp(false);
        }, 2000);
      } else {
        console.log('로그인 성공', data);
        if (data.token) {
            localStorage.setItem('token', data.token); // 서버에서 받은 토큰 저장
            setIsLoggedIn(true);
        } else {
            throw new Error('토큰이 응답에 포함되지 않았습니다.');
        }
      }
    } catch (error) {
      console.error('에러:', error);
      setError(error.message || '처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setUserNickname('');
    setUserName('');
    setUserPassword('');
    setUserBirthday('');
    setUserEmail('');
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
  };

  if (isLoggedIn) {
    return <Dashboard />; // 로그인 상태면 대시보드 표시
  }

  return (
    <div className="container">
      <h1>{showSignUp ? '회원가입' : '로그인'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userId">아이디</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        {showSignUp && (
          <>
            <div className="input-group">
              <label htmlFor="userNickname">닉네임</label>
              <input
                id="userNickname"
                type="text"
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="userName">이름</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="userEmail">이메일</label>
              <input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="userBirthday">생년월일 (YYYYMMDD)</label>
              <input
                id="userBirthday"
                type="text"
                value={userBirthday}
                onChange={(e) => setUserBirthday(e.target.value)}
                pattern="\d{8}"
                maxLength="8"
                required
              />
            </div>
          </>
        )}
        <div className="input-group">
          <label htmlFor="userPassword">비밀번호</label>
          <input
            id="userPassword"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : (showSignUp ? '가입하기' : '로그인')}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <p className="switch-text">
        {showSignUp ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
        <button className="link-btn" onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? '로그인' : '회원가입'}
        </button>
      </p>
    </div>
  );
}

export default App;
