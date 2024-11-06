'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

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
        <div className="text-center mb-4">
          <span className="text-2xl font-semibold">배치전</span>
        </div>
      )
    }

    const levelDisplay = userData.userLevel === 5 ? "5(max)" : userData.userLevel
    return (
      <>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">{levelDisplay}</span>
          <span className="text-xl ml-2">/ 5</span>
        </div>
        <Progress value={userData.userLevel} max={5} className="w-full h-4" />
      </>
    )
  }, [userData])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">사용자 데이터를 불러올 수 없습니다.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 프로필</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>사용자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{userData.userNickname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{userData.userName}</h2>
                <p className="text-gray-500">{userData.userNickname}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>ID:</strong> {userData.userId}</p>
              <p><strong>Email:</strong> {userData.userEmail}</p>
              <p><strong>생일:</strong> {new Date(userData.userBirthday).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Level</CardTitle>
          </CardHeader>
          <CardContent>
            {renderLevelInfo}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>풀었던 문제</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">사용자가 풀었던 문제 목록</caption>
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">문제</th>
                  <th className="text-left p-2">날짜</th>
                  <th className="text-left p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                {userData.problemHistory.map((problem) => (
                  <tr key={problem.id} className="border-b">
                    <td className="p-2">{problem.title}</td>
                    <td className="p-2">{new Date(problem.date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded ${problem.result === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {problem.result === 'correct' ? '정답' : '오답'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}