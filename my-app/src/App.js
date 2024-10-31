import React, { useState } from 'react';
import './App.css';

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
  const [successMessage, setSuccessMessage] = useState(''); //성공메시지 추가
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // 성공 메시지 초기화
    setIsLoading(true);

    const url = showSignUp
      ? '/api/user/signup'
      : '/api/user/login';
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
      : JSON.stringify({ userId: userId, password: userPassword });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '서버 오류가 발생했습니다.');
      }

      if (showSignUp) {
        setSuccessMessage('회원가입 성공! 로그인 화면으로 돌아갑니다.'); // 성공 메시지 설정
        setTimeout(() => {
          setShowSignUp(false); // 로그인 화면으로 전환
        }, 2000); // 화면으로
      } else {
        console.log('로그인 성공', data);
        setIsLoggedIn(true);
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
  };

  if (isLoggedIn) {
    return (
      <div className="container">
        <h1>환영합니다!</h1>
        <p>성공적으로 로그인되었습니다.</p>
        <button className="btn" onClick={handleLogout}>로그아웃</button>
      </div>
    );
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
      {successMessage && <p className="success">{successMessage}</p>} {/* 성공 메시지 추가 */}
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
