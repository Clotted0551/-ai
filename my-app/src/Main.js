import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css'; // 이 파일에 스타일을 추가할 것입니다.

function Main() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/myPage');  // My Profile 버튼 클릭 시 myPage.js로 이동
  };

  const PlacementTestClick = () => {
    navigate('/placementTest')
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <header>
        <div className="header-content">
          <h1>파인 에듀</h1>
          <div className="user-menu">
            <button className="avatar-button">
              {user.nickname.charAt(0)}
            </button>
            <div className="dropdown-content">
              <p>{user.nickname}</p>
              <p>{user.email}</p>
              <hr />
              <button onClick={handleProfileClick}>My Profile</button> {/* 버튼 클릭 시 myPage로 이동 */}
              <button onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content">
          <h2>환영합니다, {user.userName}!</h2>
          <p>학습할 준비가 되셨나요?</p>
          <div className="button-group">
            <button className="main-button" onClick={PlacementTestClick}>배치고사</button>
            <button className="main-button">학습시작!</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;
