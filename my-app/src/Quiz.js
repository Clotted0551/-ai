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
  DialogActions,
  Box
} from '@mui/material';
import TopBar from './components/TopBar';

const QuizApp = () => {
  const [quiz, setQuiz] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userExp, setUserExp] = useState(0);
  const [quizCategory, setQuizCategory] = useState('gpt');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [levelChangeModal, setLevelChangeModal] = useState(false);
  const [levelChangeMessage, setLevelChangeMessage] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [quizCategory]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?category=${quiz_Category}`);
      const data = await response.json();
      setQuiz(data.quiz);
      setUserLevel(data.userLevel);
      setUserExp(data.userExp);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === quiz.quiz_Answer;
    let newExp = userExp + (isCorrect ? 5 : -3);
    let newLevel = userLevel;

    if (newExp >= 100) {
      newLevel = userLevel + 1;
      newExp -= 100;
      setLevelChangeMessage(`축하합니다! 레벨이 ${newLevel}로 승급하였습니다!`);
      setLevelChangeModal(true);
    } else if (newExp < 0 && userLevel > 1) {
      newLevel = userLevel - 1;
      newExp = 97;
      setLevelChangeMessage(`${newLevel}로 강등당했습니다.`);
      setLevelChangeModal(true);
    }

    setUserExp(newExp);
    setUserLevel(newLevel);

    // 서버에 업데이트된 레벨과 경험치 전송
    updateUserDataOnServer(newLevel, newExp);
  };

  const updateUserDataOnServer = async (level, exp) => {
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, exp }),
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleNextQuestion = () => {
    fetchQuiz();
  };

  const renderQuizContent = () => {
    if (!quiz) return null;

    const [question, ...options] = quiz.quiz_Question.split('\n');

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
                ? (index + 1).toString() === quiz.quiz_Answer 
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
            style={{ marginTop: '20px', color: selectedAnswer === quiz.quiz_Answer ? 'green' : 'red' }}
          >
            {quiz.quiz_Comment}
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">레벨: {userLevel}</Typography>
          <FormControl style={{ minWidth: 120 }}>
            <InputLabel>퀴즈 카테고리</InputLabel>
            <Select
              value={quizCategory}
              onChange={(e) => setQuizCategory(e.target.value)}
            >
              <MenuItem value="gpt">GPT</MenuItem>
              <MenuItem value="ollama">Ollama</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={userExp} 
          style={{ marginBottom: '20px', height: '10px' }}
        />
        {renderQuizContent()}
      </Container>
      <Dialog open={levelChangeModal} onClose={() => setLevelChangeModal(false)}>
        <DialogTitle>레벨 변경</DialogTitle>
        <DialogContent>
          <Typography>{levelChangeMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLevelChangeModal(false)}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizApp;

