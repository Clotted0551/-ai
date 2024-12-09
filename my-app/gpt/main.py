from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import mysql.connector
from dotenv import load_dotenv
import os

# .env 파일에서 API 키 불러오기
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# MySQL 연결 설정
def connect_to_db():
    return mysql.connector.connect(
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",  # MySQL 호스트 주소
        user="admin",  # MySQL 사용자명
        password="wkdalswns0551!",  # MySQL 비밀번호
        database="economy"  # 사용할 데이터베이스
    )

# 문제 요청 모델 정의
class QuizRequest(BaseModel):
    level: int  # 문제 난이도 (1~5)

# 문제 생성 함수
def generate_economic_question(level: int):
    prompt = f"""
    문제 난이도를 1부터 5까지라고 했을 때 레벨 {level}에 맞는 경제퀴즈(주식, 채권, 부동산 정책, 경제역사 등)를 생성해주세요. 
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

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

# MySQL에 데이터 저장 함수
def save_to_db(level, question, answer, explanation, model):
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
        query = """
        INSERT INTO quiz (quiz_level, quiz_question, quiz_answer, quiz_comment, quiz_category) 
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (level, question, answer, explanation, model))
        connection.commit()
        return {"message": f"Level {level} data saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        connection.close()

# API 엔드포인트
@app.post("/generate-quiz/")
async def generate_quiz(request: QuizRequest):
    level = request.level
    if not (1 <= level <= 5):
        raise HTTPException(status_code=400, detail="Level must be between 1 and 5.")

    try:
        # 퀴즈 생성
        result = generate_economic_question(level)
        print(f"Generated result: {result}")

        if "문제:" in result and "정답:" in result and "해설:" in result:
            question_part, answer_explanation = result.split("정답:", 1)
            question = question_part.replace("문제:", "").strip()
            answer, explanation = answer_explanation.split("해설:", 1)
            answer = answer.strip()
            explanation = explanation.strip()

            # 데이터베이스 저장
            model = "gpt"
            save_to_db(level, question, answer, explanation, model)
            return {
                "level": level,
                "question": question,
                "answer": answer,
                "explanation": explanation,
                "message": "Quiz generated and saved successfully!"
            }
        else:
            raise HTTPException(status_code=500, detail="Quiz generation format invalid.")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


