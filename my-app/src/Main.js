'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Box,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

const MainButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 3),
}))

export default function Main() {
  const [user, setUser] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/')
      }
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleProfileClick = () => {
    navigate('/myPage')
    handleClose()
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePlacementTest = () => {
    navigate('/PlacementTest')
  }

  const handleStartLearning = () => {
    navigate('/Quiz')
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            파인 에듀
          </Typography>
          <Button color="inherit" component={Link} href="/portfolio">
            최적화 포트폴리오!
          </Button>
          <div>
            <Button
              onClick={handleMenu}
              color="inherit"
              startIcon={
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.nickname.charAt(0)}
                </Avatar>
              }
            >
              {user.nickname}
            </Button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>{user.nickname}</MenuItem>
              <MenuItem disabled>{user.email}</MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            환영합니다, {user.userName}!
          </Typography>
          <Typography variant="h6" gutterBottom>
            {user.userLevel !== null 
              ? `현재 레벨: ${user.userLevel}`
              : "배치고사를 진행해 주세요!"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            학습할 준비가 되셨나요?
          </Typography>
          <Box sx={{ mt: 3 }}>
            <MainButton variant="contained" color="primary" onClick={handlePlacementTest}>
              배치고사
            </MainButton>
            <MainButton variant="contained" color="secondary" onClick={handleStartLearning}>
              학습시작!
            </MainButton>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  )
}