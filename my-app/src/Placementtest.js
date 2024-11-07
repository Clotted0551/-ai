import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';

// PlacementTest.json 파일에서 문제 가져오기
import 문제들 from './PlacementTest.json';

function PlacementTest() {
  const [현재문제, set현재문제] = useState(0);
  const [사용자답변, set사용자답변] = useState({});
  const [제출중, set제출중] = useState(false);
  const navigate = useNavigate();

  const 답변처리 = (event) => {
    set사용자답변({
      ...사용자답변,
      [현재문제]: event.target.value,
    });
  };

  const 다음문제 = () => {
    if (현재문제 < 문제들.length - 1) {
      set현재문제(현재문제 + 1);
    }
  };

  const 이전문제 = () => {
    if (현재문제 > 0) {
      set현재문제(현재문제 - 1);
    }
  };

  const 점수계산 = () => {
    let 총점 = 0;
    문제들.forEach((문제, 인덱스) => {
      if (사용자답변[인덱스] === 문제.answer) {
        총점 += 문제.score;
      }
    });
    return 총점;
  };

  const 레벨계산 = (점수) => {
    if (점수 >= 34) return 5;
    if (점수 >= 27) return 4;
    if (점수 >= 20) return 3;
    if (점수 >= 13) return 2;
    return 1;
  };

  const 제출처리 = async () => {
    set제출중(true);
    const 점수 = 점수계산();
    const 레벨 = 레벨계산(점수);

    try {
      const 응답 = await fetch('/api/user/levelTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ level: 레벨 }),
      });

      if (응답.ok) {
        navigate('/result');
      } else {
        throw new Error('레벨 제출 실패');
      }
    } catch (에러) {
      console.error('레벨 제출 중 에러 발생:', 에러);
      alert('레벨 제출에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      set제출중(false);
    }
  };

  return (
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
            disabled={제출중}
          >
            {제출중 ? '제출 중...' : '제출'}
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
    </Container>
  );
}

export default PlacementTest;