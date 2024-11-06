import { useState, useEffect, useMemo } from 'react'
import './myPage_styles.css'; // styles.css를 import

export default function MyProfile() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/myPage', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        setError('사용자 데이터를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.')
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const renderLevelInfo = useMemo(() => {
    if (!userData || userData.userLevel === null) {
      return (
        <div className="level-info">
          <span className="level-text">배치전</span>
        </div>
      )
    }

    const levelDisplay = userData.userLevel === 5 ? "5(max)" : userData.userLevel
    return (
      <div className="level-info">
        <span className="level-text">{levelDisplay}</span>
        <span className="level-max">/ 5</span>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${(userData.userLevel / 5) * 100}%` }}></div>
        </div>
      </div>
    )
  }, [userData])

  if (isLoading) {
    return <div className="loading">로딩 중...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!userData) {
    return <div className="loading">사용자 데이터를 불러올 수 없습니다.</div>
  }

  return (
    <div className="container">
      <h1 className="page-title">내 프로필</h1>
      <div className="grid-container">
        <div className="card">
          <div className="card-header">사용자 정보</div>
          <div className="card-content">
            <div className="avatar-container">
              <div className="avatar">
                <span className="avatar-fallback">{userData.userNickname.charAt(0)}</span>
              </div>
              <div className="info">
                <h2>{userData.userName}</h2>
                <p className="nickname">{userData.userNickname}</p>
              </div>
            </div>
            <div className="user-info">
              <p><strong>ID:</strong> {userData.userId}</p>
              <p><strong>Email:</strong> {userData.userEmail}</p>
              <p><strong>생일:</strong> {new Date(userData.userBirthday).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Level</div>
          <div className="card-content">
            {renderLevelInfo}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">풀었던 문제</div>
        <div className="card-content">
          <table>
            <caption>사용자가 풀었던 문제 목록</caption>
            <thead>
              <tr>
                <th>문제</th>
                <th>날짜</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {userData.problemHistory.map((problem) => (
                <tr key={problem.id}>
                  <td>{problem.title}</td>
                  <td>{new Date(problem.date).toLocaleDateString()}</td>
                  <td>
                    <span className={problem.result === 'correct' ? 'status-correct' : 'status-incorrect'}>
                      {problem.result === 'correct' ? '정답' : '오답'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
