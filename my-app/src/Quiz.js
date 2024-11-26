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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const AnswerFeedback = styled(Typography)(({ correct }) => ({
  color: correct ? 'green' : 'red',
  fontWeight: 'bold',
  marginTop: '10px',
}));

function QuizApp() {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCategory, setQuizCategory] = useState('gpt');

  useEffect(() => {
    fetchQuiz();
  }, [quizCategory]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?category=${quizCategory}`);
      const data = await response.json();
      setQuiz(data);
      setSelectedAnswer('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
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

  if (!quiz) return <Typography>Loading...</Typography>;

  const [question, ...choices] = quiz.quizQuestion.split('\n');

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
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

        <Typography variant="h5" gutterBottom>
          {question}
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            {choices.map((choice, index) => (
              <FormControlLabel
                key={index}
                value={choice.substring(3)}
                control={<Radio />}
                label={choice}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer || showFeedback}
          style={{ marginTop: '20px' }}
        >
          제출
        </Button>

        {showFeedback && (
          <>
            <AnswerFeedback correct={selectedAnswer === quiz.quizAnswer}>
              {selectedAnswer === quiz.quizAnswer ? '정답입니다!' : '틀렸습니다.'}
            </AnswerFeedback>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              {quiz.quizComment}
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
  );
}

export default QuizApp;