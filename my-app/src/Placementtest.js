import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Box,
  ThemeProvider,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { ThemeContext } from './ThemeContext';

export default function PlacementTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/PlacementTest.json');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (event) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion]: event.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        totalScore += question.score;
      }
    });
    return totalScore;
  };

  const calculateLevel = (score) => {
    if (score >= 34) return 5;
    if (score >= 27) return 4;
    if (score >= 20) return 3;
    if (score >= 13) return 2;
    return 1;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const level = calculateLevel(score);
    setUserLevel(level);
    setIsSubmitted(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (questions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>문제를 불러오는 중...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ my: 4 }}>
          배치고사
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              문제 {currentQuestion + 1} / {questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {questions[currentQuestion].question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={userAnswers[currentQuestion] || ''}
                onChange={handleAnswer}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.charAt(0)}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            이전
          </Button>
          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              {isSubmitted ? '제출 완료' : '제출'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!userAnswers[currentQuestion]}
            >
              다음
            </Button>
          )}
        </Box>
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"배치고사 결과"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              당신의 레벨은 {userLevel}입니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" autoFocus>
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}