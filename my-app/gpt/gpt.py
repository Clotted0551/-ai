import openai
import mysql.connector
from dotenv import load_dotenv
import os

# .env 파일에서 API 키 불러오기
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# MySQL 연결 설정
def connect_to_db():
    return mysql.connector.connect(
        host="localhost",  # MySQL 호스트 주소
        user="your_username",  # MySQL 사용자명
        password="your_password",  # MySQL 비밀번호
        database="your_database"  # 사용할 데이터베이스
    )

# 문제 생성 함수
def generate_economic_question():
    prompt = "경제학 관련 어려운 문제를 하나 만들어 주세요. 형식: '문제: [문제 내용] 답: [정답 내용]'"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # gpt-3.5-turbo 모델로 변경
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=200,
        temperature=0.7
    )
    return response['choices'][0]['message']['content'].strip()

# MySQL에 데이터 저장 함수
def save_to_db(question, answer):
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
        query = "INSERT INTO economic_questions (question, answer) VALUES (%s, %s)"
        cursor.execute(query, (question, answer))
        connection.commit()
        print("Data saved successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

# 메인 실행
if __name__ == "__main__":
    # 문제 생성
    result = generate_economic_question()
    if "문제:" in result and "답:" in result:
        question, answer = result.split("답:")
        question = question.replace("문제:", "").strip()
        answer = answer.strip()

        # MySQL에 저장
        save_to_db(question, answer)
    else:
        print("문제 생성에 실패했습니다.")
