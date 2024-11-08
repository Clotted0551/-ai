import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

import Main from './Main';
import MyPage from './Mypage';
import PlacementTest from './PlacementTest';


import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 상태를 하나의 객체로 관리
  const [userData, setUserData] = useState({
    userId: '',
    userNickname: '',
    userName: '',
    userPassword: '',
    userBirthday: '',
    userEmail: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 디바운스된 상태 업데이트 함수
  const debouncedSetUserData = useCallback(
    debounce((field, value) => {
      setUserData(prevData => ({ ...prevData, [field]: value }));
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    debouncedSetUserData(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const url = showSignUp ? '/api/user/signup' : '/api/user/login';

    const body = showSignUp
      ? JSON.stringify(userData)
      : JSON.stringify({ userId: userData.userId, userPassword: userData.userPassword });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
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

  const AuthForm = React.memo(({ handleSubmit }) => (
    <div className="auth-form">
      <h2>{showSignUp ? '회원가입' : '로그인'}</h2>
      <p>{showSignUp ? '새 계정을 만들어주세요.' : '계정에 로그인하세요.'}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input
            id="userId"
            type="text"
            defaultValue={userData.userId}
            onChange={handleInputChange}
            required
          />
        </div>
        {showSignUp && (
          <>
            <div className="form-group">
              <label htmlFor="userNickname">닉네임</label>
              <input
                id="userNickname"
                type="text"
                defaultValue={userData.userNickname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userName">이름</label>
              <input
                id="userName"
                type="text"
                defaultValue={userData.userName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail">이메일</label>
              <input
                id="userEmail"
                type="email"
                defaultValue={userData.userEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userBirthday">생년월일 (YYYYMMDD)</label>
              <input
                id="userBirthday"
                type="text"
                defaultValue={userData.userBirthday}
                onChange={handleInputChange}
                pattern="\d{8}"
                maxLength={8}
                required
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="userPassword">비밀번호</label>
          <input
            id="userPassword"
            type="password"
            defaultValue={userData.userPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : (showSignUp ? '가입하기' : '로그인')}
        </button>
      </form>
      <p>
        {showSignUp ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
        <button className="link-button" onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? '로그인' : '회원가입'}
        </button>
      </p>
    </div>
  ));

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/Main" /> : (
              <>
                <AuthForm handleSubmit={handleSubmit} />
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
              </>
            )
          } />
          <Route path="/Main" element={isLoggedIn ? <Main /> : <Navigate to="/" />} />
          <Route path="/Mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
          <Route path="/PlacementTest" element={isLoggedIn ? <PlacementTest /> : <Navigate to="/" />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

//app.js 37