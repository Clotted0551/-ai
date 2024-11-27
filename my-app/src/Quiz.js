import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper, 
  Select, 
  MenuItem 
} from '@mui/material';
import { styled } from '@mui/system';
import TopBar from './components/TopBar'; // 상단바 컴포넌트 임포트

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const AnswerFeedback = styled(Typography)(({ correct }) => ({
  color: correct === true ? 'green' : correct === false ? 'red' : 'inherit',
  fontWeight: 'bold',
  marginTop: '10px',
}));

function QuizApp() {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCategory, setQuizCategory] = useState('gpt');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizCategory]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quiz?category=${quizCategory}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      if (!data || !data.quizQuestion || !data.quizAnswer) {
        throw new Error('Incomplete quiz data received.');
      }

      setQuiz(data);
      setSelectedAnswer('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuiz({
        quizQuestion: '퀴즈를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        quizAnswer: '',
        quizComment: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    fetchQuiz();
  };

  const handleCategoryChange = (event) => {
    setQuizCategory(event.target.value);
  };

  const handleLogout = () => {
    // 로그아웃 처리 (예: 토큰 삭제 후 로그인 페이지로 이동)
    console.log('로그아웃');
  };

  if (loading) return <Typography>Loading...</Typography>;

  if (!quiz) return <Typography>퀴즈 데이터를 불러오지 못했습니다.</Typography>;

  const [question, ...choices] = (quiz.quizQuestion || '').split('\n');
  if (!question || choices.length === 0) {
    return <Typography>퀴즈 데이터가 잘못되었습니다.</Typography>;
  }

  return (
    <>
      <TopBar onLogout={handleLogout} /> {/* 상단바 추가 */}
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          {/* Category Selector */}
          <FormControl fullWidth margin="normal">
            <Select
              value={quizCategory}
              onChange={handleCategoryChange}
              displayEmpty
            >
              <MenuItem value="gpt">GPT</MenuItem>
              <MenuItem value="ollama">Ollama</MenuItem>
            </Select>
          </FormControl>

          {/* Quiz Question */}
          <Typography variant="h5" gutterBottom>
            {question}
          </Typography>

          {/* Quiz Options */}
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            >
              {choices.map((choice, index) => (
                <FormControlLabel
                  key={`${choice}-${index}`}
                  value={choice.substring(3)}
                  control={<Radio />}
                  label={choice}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer || showFeedback}
            style={{ marginTop: '20px' }}
          >
            제출
          </Button>

          {/* Feedback and Explanation */}
          {showFeedback && (
            <>
              <AnswerFeedback correct={selectedAnswer === quiz.quizAnswer}>
                {selectedAnswer === quiz.quizAnswer ? '정답입니다!' : '틀렸습니다.'}
              </AnswerFeedback>
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                {quiz.quizComment || '추가 설명이 없습니다.'}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNextQuestion}
                style={{ marginTop: '20px' }}
              >
                다음 문제
              </Button>
            </>
          )}
        </StyledPaper>
      </Container>
    </>
  );
}

export default QuizApp;
