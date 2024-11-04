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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <header>
        <div className="header-content">
          <h1>Learning Platform</h1>
          <div className="user-menu">
            <button className="avatar-button">
              {user.nickname.charAt(0)}
            </button>
            <div className="dropdown-content">
              <p>{user.nickname}</p>
              <p>{user.email}</p>
              <hr />
              <button>My Profile</button>
              <button onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="main-content">
          <h2>Welcome, {user.nickname}!</h2>
          <p>Ready to start your learning journey?</p>
          <div className="button-group">
            <button className="main-button">Placement Test</button>
            <button className="main-button">Start Learning</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;