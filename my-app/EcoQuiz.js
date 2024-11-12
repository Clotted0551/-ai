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
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { ArrowBack, Book } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 1,
    level: 1,
    text: "다음 중 경제학의 기본 개념이 아닌 것은?",
    options: ["희소성", "영구성", "기회비용", "한계효용"],
    correctAnswer: "2"
  },
  {
    id: 2,
    level: 2,
    text: "GDP는 무엇의 약자인가?",
    options: ["Global Domestic Product", "Gross Domestic Product", "General Domestic Product", "Grand Domestic Product"],
    correctAnswer: "2"
  },
  {
    id: 3,
    level: 3,
    text: "다음 중 수요의 법칙을 가장 잘 설명하는 것은?",
    options: [
      "가격이 상승하면 수요량이 증가한다",
      "가격이 하락하면 수요량이 감소한다",
      "가격이 상승하면 수요량이 감소한다",
      "가격과 수요량은 관계가 없다"
    ],
    correctAnswer: "3"
  },
  {
    id: 4,
    level: 4,
    text: "다음 중 케인즈 경제학의 주요 주장이 아닌 것은?",
    options: [
      "정부의 시장 개입이 필요하다",
      "총수요 관리가 중요하다",
      "시장은 항상 균형을 이룬다",
      "불황 시 정부 지출을 늘려야 한다"
    ],
    correctAnswer: "3"
  },
  {
    id: 5,
    level: 5,
    text: "다음 중 스태그플레이션(Stagflation)을 가장 잘 설명하는 것은?",
    options: [
      "경제 성장률이 높고 물가가 안정된 상태",
      "경제 성장률이 낮고 실업률이 높은 상태",
      "경제 성장률이 낮고 물가 상승률이 높은 상태",
      "경제 성장률이 높고 실업률이 낮은 상태"
    ],
    correctAnswer: "3"
  }
];

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

  useEffect(() => {
    if (questions.length > 0) {
      const timer = setTimeout(() => setShowQuestion(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (isChecking) return;
    setIsChecking(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + currentQuestion.level);
      setShowScoreAnimation(true);
      setTimeout(() => {
        setShowScoreAnimation(false);
        goToNextQuestion();
        setIsChecking(false);
      }, 1500);
    } else {
      goToNextQuestion();
      setIsChecking(false);
    }
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
          <Box sx={{ width: 48 }} /> {/* 우측 여백 맞추기 */}
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
                          레벨 {currentQuestion.level}
                        </Typography>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {currentQuestion.text}
                      </Typography>
                      <RadioGroup 
                        value={selectedAnswer} 
                        onChange={handleAnswerChange}
                        sx={{ my: 2 }}
                      >
                        {currentQuestion.options.map((option, index) => (
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
                            +{currentQuestion.level}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      난이도
                    </Typography>
                    <LevelIndicator>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <LevelDot key={level} active={level <= currentQuestion.level} />
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