'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import AgeSelection from './components/AgeSelection'
import StrategySelection from './components/StrategySelection'
import LoadingPopup from './components/LoadingPopup'
import PortfolioChart from './components/PortfolioChart'
import TopBar from './components/TopBar'
import { AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const portfolioData = {
  "경기침체 확률": 39.0,
  "조정된 포트폴리오": {
    "청년층": {
      "공격적": {
        "위험자산": 76.1,
        "안전자산": 23.9
      },
      "수비적": {
        "위험자산": 56.1,
        "안전자산": 43.9
      }
    },
    "중년층": {
      "공격적": {
        "위험자산": 66.1,
        "안전자산": 33.9
      },
      "수비적": {
        "위험자산": 46.1,
        "안전자산": 53.9
      }
    },
    "장년층": {
      "공격적": {
        "위험자산": 46.1,
        "안전자산": 53.9
      },
      "수비적": {
        "위험자산": 26.1,
        "안전자산": 73.9
      }
    }
  }
}

export default function Home() {
  const [age, setAge] = useState(null)
  const [strategy, setStrategy] = useState(null)
  const [loading, setLoading] = useState(false)
  const [portfolio, setPortfolio] = useState(null)

  useEffect(() => {
    if (age && strategy) {
      setLoading(true)
      setTimeout(() => {
        setPortfolio(portfolioData["조정된 포트폴리오"][age][strategy])
        setLoading(false)
      }, 5000)
    }
  }, [age, strategy])

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <TopBar onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-600">경기침체 대비 포트폴리오</CardTitle>
          </CardHeader>
          <CardContent>
            {!age && (
              <div className="mb-8">
                <h2 className="text-2xl mb-4 text-center font-semibold text-gray-700">나이대를 선택하세요</h2>
                <AgeSelection onSelect={setAge} />
              </div>
            )}
            {age && !strategy && (
              <div className="mb-8">
                <h2 className="text-2xl mb-4 text-center font-semibold text-gray-700">투자 전략을 선택하세요</h2>
                <StrategySelection onSelect={setStrategy} />
              </div>
            )}
            <AnimatePresence>
              {loading && <LoadingPopup />}
            </AnimatePresence>
            {portfolio && (
              <div className="mt-8 h-[500px]">
                <h2 className="text-2xl mb-4 text-center font-semibold text-gray-700">조정된 포트폴리오</h2>
                <PortfolioChart data={portfolio} />
                <p className="mt-6 text-center text-lg font-medium text-blue-600">
                  경기침체 확률: <span className="font-bold">{portfolioData["경기침체 확률"]}%</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

