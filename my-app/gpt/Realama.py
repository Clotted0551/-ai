from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
import requests

app = FastAPI()

# MySQL 연결 함수
def connect_to_db():
    return mysql.connector.connect(
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",
        user="admin",
        password="wkdalswns0551!",
        database="economy"
    )

# MySQL 데이터 저장 함수
def save_to_db(level, question, answer, explanation, model):
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
        query = "INSERT INTO quiz (quiz_level, quiz_question, quiz_answer, quiz_comment, quiz_category) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (level, question, answer, explanation, "ollama"))
        connection.commit()
        print(f"Level {level} data saved successfully!")
    except Exception as e:
        print(f"Error: {e}")
        raise e
    finally:
        cursor.close()
        connection.close()

# EEVE-Korean-10.8B:latest 모델 호출 함수
def generate_economic_question(level):
    prompt = f"""
    문제 난이도를 1부터 5까지라고 했을 때 레벨 {level}에 맞는 경제퀴즈(주식, 채권, 부동산 정책, 경제역사등등..)를 생성해주세요. 
    각 문제는 4지선다형 객관식 문제로 작성해야 하며, 정답과 해설을 포함해야 합니다. 
    형식은 다음과 같습니다:
    문제: [문제 내용]
    1. [선지 1]
    2. [선지 2]
    3. [선지 3]
    4. [선지 4]
    정답: [정답 번호]
    해설: [정답의 이유]
    """

    # EEVE 모델 API 호출 (사용자에 맞는 API URL로 변경 필요)
    api_url = "http://127.0.0.1:8000/completion"
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "EEVE-Korean-10.8B:latest",
        "prompt": prompt,
        "max_tokens": 300
    }

    response = requests.post(api_url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json().get("completion", "")
    else:
        raise HTTPException(status_code=500, detail="Model API call failed.")

# Request Body 정의
class QuizRequest(BaseModel):
    level: int

@app.post("/generate-quiz/")
def create_quiz(request: QuizRequest):
    try:
        # 문제 생성
        quiz_data = generate_economic_question(request.level)

        # 결과 파싱 (문제, 선택지, 정답, 해설 추출 필요)
        lines = quiz_data.split('\n')
        question = lines[0].replace("문제: ", "").strip()
        options = [line.strip() for line in lines[1:5]]
        answer_line = next(line for line in lines if line.startswith("정답:"))
        explanation_line = next(line for line in lines if line.startswith("해설:"))

        answer = answer_line.replace("정답: ", "").strip()
        explanation = explanation_line.replace("해설: ", "").strip()

        # MySQL 저장
        save_to_db(request.level, question, answer, explanation, "EEVE-Korean-10.8B:latest")

        return {
            "level": request.level,
            "question": question,
            "options": options,
            "answer": answer,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-multiple-quizzes/")
def create_multiple_quizzes():
    results = []
    try:
        for level in range(1, 6):
            # 문제 생성
            quiz_data = generate_economic_question(level)

            # 결과 파싱 (문제, 선택지, 정답, 해설 추출 필요)
            lines = quiz_data.split('\n')
            question = lines[0].replace("문제: ", "").strip()
            options = [line.strip() for line in lines[1:5]]
            answer_line = next(line for line in lines if line.startswith("정답:"))
            explanation_line = next(line for line in lines if line.startswith("해설:"))

            answer = answer_line.replace("정답: ", "").strip()
            explanation = explanation_line.replace("해설: ", "").strip()

            # MySQL 저장
            save_to_db(level, question, answer, explanation, "EEVE-Korean-10.8B:latest")

            results.append({
                "level": level,
                "question": question,
                "options": options,
                "answer": answer,
                "explanation": explanation
            })

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
