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
  const [quiz, setQuiz] = useState([]); // 문제 묶음
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 문제의 인덱스
  const [userLevel, setUserLevel] = useState(1); // 유저 레벨
  const [userExp, setUserExp] = useState(0); // 유저 경험치
  const [quizCategory, setQuizCategory] = useState('gpt'); // 퀴즈 카테고리
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [levelChangeModal, setLevelChangeModal] = useState(false);
  const [levelChangeMessage, setLevelChangeMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false); // 저장 로딩 상태

  useEffect(() => {
    fetchQuiz();
  }, [quizCategory]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?category=${quizCategory}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setUserLevel(data.userLevel);
        setUserExp(data.userExp);
        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentQuestionIndex(0);
      } else {
        console.error('Failed to fetch quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentQuestion = quiz[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.quizAnswer;

    // 경험치 및 레벨 업데이트 로직
    let newExp = userExp + (isCorrect ? 5 : -3);
    let newLevel = userLevel;

    if (newExp >= 100) {
      newLevel += 1;
      newExp -= 100;
      setLevelChangeMessage(`축하합니다! 레벨이 ${newLevel}로 승급하였습니다!`);
      setLevelChangeModal(true);
    } else if (newExp < 0 && userLevel > 1) {
      newLevel -= 1;
      newExp = 97;
      setLevelChangeMessage(`${newLevel}로 강등당했습니다.`);
      setLevelChangeModal(true);
    }

    setUserExp(newExp);
    setUserLevel(newLevel);

    // 서버에 업데이트된 데이터 전송
    updateUserDataOnServer(newLevel, newExp);

    // 문제 히스토리 저장
    saveProblemHistory(currentQuestion.id, currentQuestion.quizQuestion, isCorrect ? 'correct' : 'incorrect');
  };

  const updateUserDataOnServer = async (level, exp) => {
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, exp }),
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const saveProblemHistory = async (id, question, result) => {
    if (!id || !question || !result) {
      console.error('Invalid problem data:', { id, question, result });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing');
      return;
    }

    setIsSaving(true); // 저장 중 상태 활성화
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, question, result }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save problem history:', errorData.message || response.statusText);
      } else {
        console.log('Problem history saved successfully');
      }
    } catch (error) {
      console.error('Error saving problem history:', error);
    } finally {
      setIsSaving(false); // 저장 중 상태 비활성화
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      fetchQuiz(); // 모든 문제를 푼 경우 새 문제 가져오기
    }
  };

  const renderQuizContent = () => {
    if (quiz.length === 0) return null;

    const currentQuestion = quiz[currentQuestionIndex];
    const lines = currentQuestion.quizQuestion.split('\n');
    const question = lines[0].trim();
    const options = lines.slice(1).filter(line => /^\d\./.test(line.trim()));

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
                ? (index + 1).toString() === currentQuestion.quizAnswer 
                  ? 'green' 
                  : (index + 1).toString() === selectedAnswer 
                    ? 'red' 
                    : ''
                : ''
            }}
            onClick={() => handleAnswerSelect((index + 1).toString())}
            disabled={showResult}
          >
            {option.trim()}
          </Button>
        ))}
        {showResult && (
          <Typography 
            variant="body1" 
            style={{ marginTop: '20px', color: selectedAnswer === currentQuestion.quizAnswer ? 'green' : 'red' }}
          >
            {currentQuestion.quizComment}
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
        {isSaving && <Typography variant="body2">히스토리 저장 중...</Typography>}
        {renderQuizContent()}
      </Container>
      <Dialog open={levelChangeModal} onClose={() => setLevelChangeModal(false)}>
        <DialogTitle>레벨 변경</DialogTitle>
        <DialogContent>
          <Typography>{levelChangeMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLevelChangeModal(false)} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizApp;
