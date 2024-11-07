import React, { useState } from 'react'
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
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

// 가상의 문제 데이터
const 문제들 = [
  {
    question: "기준금리를 결정하는 주체는?",
    options: [
      "A. 중앙은행",
      "B. 재정경제부",
      "C. 상업은행",
      "D. 금융위원회"
    ],
    answer: "A",
    score: 1
  },
  {
    question: "인플레이션이란?",
    options: [
      "A. 물가 상승",
      "B. 물가 하락",
      "C. 경제 성장",
      "D. 경제 침체"
    ],
    answer: "A",
    score: 1
  },
  // 추가 18개의 문제를 여기에 넣어주세요
]

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#424242',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

export default function PlacementTest() {
  const [현재문제, set현재문제] = useState(0)
  const [사용자답변, set사용자답변] = useState({})
  const [제출완료, set제출완료] = useState(false)
  const [결과대화상자열림, set결과대화상자열림] = useState(false)

  const 답변처리 = (event) => {
    set사용자답변({
      ...사용자답변,
      [현재문제]: event.target.value,
    })
  }

  const 다음문제 = () => {
    if (현재문제 < 문제들.length - 1) {
      set현재문제(현재문제 + 1)
    }
  }

  const 이전문제 = () => {
    if (현재문제 > 0) {
      set현재문제(현재문제 - 1)
    }
  }

  const 점수계산 = () => {
    let 총점 = 0
    문제들.forEach((문제, 인덱스) => {
      if (사용자답변[인덱스] === 문제.answer) {
        총점 += 문제.score
      }
    })
    return 총점
  }

  const 레벨계산 = (점수) => {
    if (점수 >= 34) return 5
    if (점수 >= 27) return 4
    if (점수 >= 20) return 3
    if (점수 >= 13) return 2
    return 1
  }

  const 제출처리 = () => {
    const 점수 = 점수계산()
    const 레벨 = 레벨계산(점수)
    set제출완료(true)
    set결과대화상자열림(true)
  }

  const 대화상자닫기 = () => {
    set결과대화상자열림(false)
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
              문제 {현재문제 + 1} / {문제들.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {문제들[현재문제].question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={사용자답변[현재문제] || ''}
                onChange={답변처리}
              >
                {문제들[현재문제].options.map((옵션, 인덱스) => (
                  <FormControlLabel
                    key={인덱스}
                    value={옵션.charAt(0)}
                    control={<Radio />}
                    label={옵션}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            onClick={이전문제}
            disabled={현재문제 === 0}
          >
            이전
          </Button>
          {현재문제 === 문제들.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={제출처리}
              disabled={제출완료}
            >
              {제출완료 ? '제출 완료' : '제출'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={다음문제}
              disabled={!사용자답변[현재문제]}
            >
              다음
            </Button>
          )}
        </Box>
        <Dialog
          open={결과대화상자열림}
          onClose={대화상자닫기}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"배치고사 결과"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              당신의 레벨은 {레벨계산(점수계산())}입니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={대화상자닫기} color="primary" autoFocus>
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}