import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  LinearProgress, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TopBar from './components/TopBar';

const QuizApp = () => {
  const [quiz, setQuiz] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userExp, setUserExp] = useState(0);
  const [quizCategory, setQuizCategory] = useState('gpt');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizCategory]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?category=${quizCategory}`);
      const data = await response.json();
      setQuiz(data);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === quiz.quizAnswer;
    let newExp = userExp + (isCorrect ? 5 : -3);

    if (newExp >= 100) {
      setUserLevel(prevLevel => prevLevel + 1);
      newExp -= 100;
      setLevelUpModal(true);
    } else if (newExp < 0 && userLevel > 1) {
      setUserLevel(prevLevel => prevLevel - 1);
      newExp = 97; // Set to 97 so that losing 3 exp doesn't immediately trigger another level down
      setLevelUpModal(true);
    }

    setUserExp(newExp);
  };

  const handleNextQuestion = () => {
    fetchQuiz();
  };

  const renderQuizContent = () => {
    if (!quiz) return null;

    const [question, ...options] = quiz.quizQuestion.split('\n');

    return (
      <>
        <Typography variant="h5" gutterBottom>{question}</Typography>
        {options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            fullWidth
            style={{ 
              marginTop: '10px',
              backgroundColor: showResult 
                ? (index + 1).toString() === quiz.quizAnswer 
                  ? 'green' 
                  : (index + 1).toString() === selectedAnswer 
                    ? 'red' 
                    : ''
                : ''
            }}
            onClick={() => handleAnswerSelect((index + 1).toString())}
            disabled={showResult}
          >
            {option}
          </Button>
        ))}
        {showResult && (
          <Typography 
            variant="body1" 
            style={{ marginTop: '20px', color: selectedAnswer === quiz.quizAnswer ? 'green' : 'red' }}
          >
            {quiz.quizComment}
          </Typography>
        )}
        {showResult && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNextQuestion}
            style={{ marginTop: '20px' }}
          >
            다음 문제
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <TopBar onLogout={() => console.log('Logout clicked')} />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>레벨: {userLevel}</Typography>
        <LinearProgress 
          variant="determinate" 
          value={userExp} 
          style={{ marginBottom: '20px', height: '10px' }}
        />
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>퀴즈 카테고리</InputLabel>
          <Select
            value={quizCategory}
            onChange={(e) => setQuizCategory(e.target.value)}
          >
            <MenuItem value="gpt">GPT</MenuItem>
            <MenuItem value="ollama">Ollama</MenuItem>
          </Select>
        </FormControl>
        {renderQuizContent()}
      </Container>
      <Dialog open={levelUpModal} onClose={() => setLevelUpModal(false)}>
        <DialogTitle>레벨 변경</DialogTitle>
        <DialogContent>
          <Typography>
            {userExp >= 100 
              ? `축하합니다! 레벨이 ${userLevel}로 승급하였습니다!`
              : `${userLevel}로 강등당했습니다.`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLevelUpModal(false)}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizApp;

