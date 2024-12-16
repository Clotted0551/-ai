'use client'

import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AgeSelection from './components/AgeSelection'
import StrategySelection from './components/StrategySelection'
import PortfolioChart from './components/PortfolioChart'
import TopBar from './components/TopBar'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #bbdefb, #ffffff)' }}>
        <TopBar onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ pt: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" component="h1" align="center" color="primary" gutterBottom>
                경기침체 대비 포트폴리오
              </Typography>
              {!age && (
                <Box mb={4}>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    나이대를 선택하세요
                  </Typography>
                  <AgeSelection onSelect={setAge} />
                </Box>
              )}
              {age && !strategy && (
                <Box mb={4}>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    투자 전략을 선택하세요
                  </Typography>
                  <StrategySelection onSelect={setStrategy} />
                </Box>
              )}
              {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                  <CircularProgress />
                </Box>
              )}
              {portfolio && (
                <Box mt={4} height={500}>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    조정된 포트폴리오
                  </Typography>
                  <PortfolioChart data={portfolio} />
                  <Typography variant="h6" align="center" color="primary" sx={{ mt: 3 }}>
                    경기침체 확률: <Box component="span" fontWeight="bold">{portfolioData["경기침체 확률"]}%</Box>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

