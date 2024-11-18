// AuthForm.js
import React, { useState } from 'react';

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
          setIsLoggedIn(true);  // 로그인 성공 시 App.js의 isLoggedIn 상태를 업데이트
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
    <div className="auth-form">
      <h2>{showSignUp ? '회원가입' : '로그인'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="userNickname">닉네임</label>
              <input
                id="userNickname"
                type="text"
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userName">이름</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail">이메일</label>
              <input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userBirthday">생년월일 (YYYYMMDD)</label>
              <input
                id="userBirthday"
                type="text"
                value={userBirthday}
                onChange={(e) => setUserBirthday(e.target.value)}
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
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : showSignUp ? '가입하기' : '로그인'}
        </button>
      </form>
      <p>
        {showSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
        <button className="link-button" onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? '로그인' : '회원가입'}
        </button>
      </p>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default AuthForm;
