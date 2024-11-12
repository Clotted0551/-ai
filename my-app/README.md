node.js설치 필수

  리엑트 실행방법: my-app\src\App.js -> 터미널에 npm start 입력  

  ai 모델에서 json형태로 문제 생성 -> {
    id: 2,
    level: 2,
    text: "GDP는 무엇의 약자인가?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "2"
    commentation: "그 이유는~~"
  }    

레벨별 문제 사전생성 -> DB저장 -> 프런트로 문제 제시 -> 푼 문제 정답 오답 사용자 DB에 저장  

