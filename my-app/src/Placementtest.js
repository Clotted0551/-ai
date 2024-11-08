import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Typography,
  CircularProgress 
} from '@material-ui/core';
import 퀴즈데이터 from './PlacementTest.json';

const 레벨계산 = (점수) => {
  if (점수 >= 34) return 5;
  if (점수 >= 27) return 4;
  if (점수 >= 20) return 3;
  if (점수 >= 13) return 2;
  return 1;
};

export default function 배치고사() {
  const navigate = useNavigate();
  const [현재문제, set현재문제] = useState(0);
  const [사용자답변, set사용자답변] = useState(Array(퀴즈데이터.length).fill(''));
  const [점수, set점수] = useState(0);
  const [결과표시, set결과표시] = useState(false);
  const [레벨, set레벨] = useState(0);
  const [로딩중, set로딩중] = useState(false);

  useEffect(() => {
    set로딩중(false);
  }, []);

  const 답변처리 = (답변) => {
    const 새답변 = [...사용자답변];
    새답변[현재문제] = 답변;
    set사용자답변(새답변);
  };

  const 다음문제 = () => {
    if (현재문제 < 퀴즈데이터.length - 1) {
      set현재문제(현재문제 + 1);
    } else {
      점수계산();
    }
  };

  const 점수계산 = () => {
    let 총점 = 0;
    퀴즈데이터.forEach((문제, 인덱스) => {
      if (문제.answer === 사용자답변[인덱스]) {
        총점 += 문제.score;
      }
    });
    set점수(총점);
    const 계산된레벨 = 레벨계산(총점);
    set레벨(계산된레벨);
    결과제출(계산된레벨);
  };

  const 결과제출 = async (레벨) => {
    try {
      const 응답 = await fetch('/api/user/levelTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level: 레벨 }),
      });
      if (!응답.ok) {
        throw new Error('레벨 테스트 결과 제출 실패');
      }
      set결과표시(true);
      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        navigate('/Main');
      }, 3000);
    } catch (에러) {
      console.error('레벨 테스트 결과 제출 중 에러:', 에러);
    }
  };

  if (로딩중) {
    return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: 20 }}>
        <CardContent>
          <CircularProgress />
          <Typography>문제를 불러오는 중...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (결과표시) {
    return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: 20 }}>
        <CardHeader title="배치고사 결과" />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            당신의 레벨은 {레벨}입니다.
          </Typography>
          <Typography variant="body1" gutterBottom>
            총점: {점수} / {퀴즈데이터.length * 2}
          </Typography>
          <Typography variant="body2" gutterBottom>
            3초 후 메인 페이지로 이동합니다...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const 문제 = 퀴즈데이터[현재문제];

  if (!문제) {
    return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: 20 }}>
        <CardContent>
          <Typography>문제를 불러오는 중 오류가 발생했습니다.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: 'auto', marginTop: 20 }}>
      <CardHeader title="배치고사" />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          문제 {현재문제 + 1}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {문제.question}
        </Typography>
        <RadioGroup value={사용자답변[현재문제]} onChange={(e) => 답변처리(e.target.value)}>
          {문제.options.map((옵션, 인덱스) => (
            <FormControlLabel
              key={인덱스}
              value={옵션.charAt(0)}
              control={<Radio />}
              label={옵션}
            />
          ))}
        </RadioGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={다음문제}
          disabled={!사용자답변[현재문제]}
          style={{ marginTop: 20 }}
        >
          {현재문제 === 퀴즈데이터.length - 1 ? '제출' : '다음'}
        </Button>
      </CardContent>
    </Card>
  );
}