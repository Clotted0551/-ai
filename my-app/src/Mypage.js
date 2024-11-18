import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

export default function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/myPage', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError('사용자 데이터를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderLevelInfo = useMemo(() => {
    if (!userData || userData.userLevel === null) {
      return (
        <Box textAlign="center" mb={2}>
          <Typography variant="h4">배치전</Typography>
        </Box>
      );
    }

    const levelDisplay = userData.userLevel === 5 ? "5(max)" : userData.userLevel;
    return (
      <>
        <Box textAlign="center" mb={2}>
          <Typography variant="h3" component="span">{levelDisplay}</Typography>
          <Typography variant="h5" component="span" ml={1}>/ 5</Typography>
        </Box>
        <LinearProgress variant="determinate" value={(userData.userLevel / 5) * 100} />
      </>
    );
  }, [userData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>사용자 데이터를 불러올 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>내 프로필</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="사용자 정보" />
            <StyledCardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                  {userData.userNickname.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">{userData.userName}</Typography>
                  <Typography color="textSecondary">{userData.userNickname}</Typography>
                </Box>
              </Box>
              <Typography><strong>ID:</strong> {userData.userId}</Typography>
              <Typography><strong>Email:</strong> {userData.userEmail}</Typography>
              <Typography><strong>생일:</strong> {new Date(userData.userBirthday).toLocaleDateString()}</Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Level" />
            <StyledCardContent>
              {renderLevelInfo}
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <CardHeader title="풀었던 문제" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table aria-label="사용자가 풀었던 문제 목록">
              <TableHead>
                <TableRow>
                  <TableCell>문제</TableCell>
                  <TableCell>날짜</TableCell>
                  <TableCell>결과</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.problemHistory.map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell>{problem.title}</TableCell>
                    <TableCell>{new Date(problem.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={problem.result === 'correct' ? '정답' : '오답'}
                        color={problem.result === 'correct' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}