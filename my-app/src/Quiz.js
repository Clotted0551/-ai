import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Typography, 
  Box,
  Container,
  Grid,
  IconButton,
  Alert,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { ArrowBack, Book } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// API로부터 문제를 가져오는 함수 (실제 구현 필요)
const fetchQuestions = async (userLevel) => {
  // 여기에 실제 API 호출 로직 구현
  // 임시 데이터:
  return [
    {
      id: 1,
      level: 2,
      point: 2,
      problem: "다음 중 경제학의 기본 개념이 아닌 것은?",
      options: ["A. 희소성", "B. 영구성", "C. 기회비용", "D. 한계효용"],
      correctAnswer: "2",
      commentation: "영구성은 경제학의 기본 개념이 아닙니다. 경제학의 기본 개념에는 희소성, 기회비용, 한계효용 등이 포함됩니다."
    },
    {
      id: 2,
      level: 2,
      point: 2,
      problem: "GDP는 무엇의 약자인가?",
      options: ["A. Global Domestic Product", "B. Gross Domestic Product", "C. General Domestic Product", "D. Grand Domestic Product"],
      correctAnswer: "2",
      commentation: "GDP는 Gross Domestic Product의 약자로, 국내 총생산을 의미합니다. 이는 한 국가 내에서 일정 기간 동안 생산된 모든 최종 재화와 서비스의 시장 가치의 합계를 나타냅니다."
    },
  ];
};

const StyledRadio = styled(Radio)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LevelIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const LevelDot = styled(Box)(({ active, theme }) => ({
  width: theme.spacing(1.5),
  height: theme.spacing(1.5),
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
}));

export default function EconomicsQuiz() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showCommentation, setShowCommentation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions(userLevel);
      setQuestions(fetchedQuestions);
      if (fetchedQuestions.length > 0) {
        const timer = setTimeout(() => setShowQuestion(true), 3000);
        return () => clearTimeout(timer);
      }
    };
    loadQuestions();
  }, [userLevel]);

  useEffect(() => {
    if (userPoints >= 50 && userLevel < 5) {
      setUserLevel(prevLevel => Math.min(prevLevel + 1, 5));
      setUserPoints(prevPoints => prevPoints - 50);
    }
  }, [userPoints, userLevel]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (isChecking) return;
    setIsChecking(true);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + currentQuestion.point);
      setUserPoints(prevPoints => prevPoints + currentQuestion.point);
      setShowScoreAnimation(true);
    }
    setShowCommentation(true);
    setTimeout(() => {
      setShowScoreAnimation(false);
      setShowCommentation(false);
      goToNextQuestion();
      setIsChecking(false);
    }, 3000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
    } else {
      // 퀴즈 종료 로직
      alert(`퀴즈가 끝났습니다! 최종 점수: ${score}`);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => console.log('Navigate to main.js')} size="small">
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Book color="primary" />
            <Typography variant="h4" component="h1" fontWeight="bold">
              경제학 퀴즈
            </Typography>
          </Box>
          <Box sx={{ width: 48 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {!showQuestion ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 128, 
                        height: 128, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.light', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2
                      }}
                    >
                      <Book sx={{ fontSize: 64, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      경제학 퀴즈에 오신 것을 환영합니다!
                    </Typography>
                    <Typography>
                      잠시 후 첫 번째 문제가 나타납니다. 준비해주세요.
                    </Typography>
                  </Box>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2">
                          문제 {currentQuestionIndex + 1}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'primary.main', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1 
                          }}
                        >
                          레벨 {currentQuestion?.level} (포인트: {currentQuestion?.point})
                        </Typography>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {currentQuestion?.problem}
                      </Typography>
                      <RadioGroup 
                        value={selectedAnswer} 
                        onChange={handleAnswerChange}
                        sx={{ my: 2 }}
                      >
                        {currentQuestion?.options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={String(index + 1)}
                            control={<StyledRadio />}
                            label={option}
                            sx={{ 
                              p: 1, 
                              borderRadius: 1, 
                              '&:hover': { bgcolor: 'action.hover' } 
                            }}
                          />
                        ))}
                      </RadioGroup>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={checkAnswer}
                        disabled={!selectedAnswer || isChecking}
                      >
                        정답 확인
                      </Button>
                      {showCommentation && (
                        <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}>
                          {currentQuestion.commentation}
                        </Alert>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  퀴즈 정보
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      현재 문제
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {currentQuestionIndex + 1} / {questions.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      총점
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" component="span" fontWeight="bold">
                        {score}
                      </Typography>
                      <AnimatePresence>
                        {showScoreAnimation && (
                          <motion.span
                            key="score-animation"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            style={{ 
                              marginLeft: '8px',
                              color: 'green',
                              fontWeight: 'bold'
                            }}
                          >
                            +{currentQuestion?.point}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      사용자 레벨
                    </Typography>
                    <Typography variant="h6" component="span" fontWeight="bold">
                      {userLevel}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      다음 레벨까지
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(userPoints / 50) * 100} 
                      sx={{ mt: 1, mb: 0.5 }}
                    />
                    <Typography variant="body2" align="right">
                      {userPoints} / 50
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      난이도
                    </Typography>
                    <LevelIndicator>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <LevelDot key={level} active={level <= (currentQuestion?.level || 0)} />
                      ))}
                    </LevelIndicator>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}