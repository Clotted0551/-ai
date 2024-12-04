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
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",  # MySQL 호스트 주소
        user="admin",  # MySQL 사용자명
        password="wkdalswns0551!",  # MySQL 비밀번호
        database="economy"  # 사용할 데이터베이스
    )

# 문제 생성 함수
def generate_economic_question(level):
    prompt = f"""
    문제 난이도를 1부터 5까지라고 했을 때 레벨 {level}에 맞는 경제퀴즈를 생성해주세요. 
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

    # 모델 호출
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # gpt-3.5-turbo 모델로 변경
        messages=[ 
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=400,  # 출력 토큰 제한 설정
        temperature=0.7  # 창의성 설정
    )
    return response['choices'][0]['message']['content'].strip()

# MySQL에 데이터 저장 함수
def save_to_db(level, question, answer, explanation, model):
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
        # 테이블에 model 항목 추가
        query = "INSERT INTO quiz (quiz_level, quiz_question, quiz_answer, quiz_comment, quiz_category) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (level, question, answer, explanation, model))
        connection.commit()
        print(f"Level {level} data saved successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

# 메인 실행
if __name__ == "__main__":
    # 각 레벨별로 1개 문제 생성
    for level in range(1, 6):
        result = generate_economic_question(level)  # 각 레벨에서 1개의 문제만 생성
        if "문제:" in result and "답:" in result:
            question, answer_explanation = result.split("답:")
            question = question.replace("문제:", "").strip()
            answer, explanation = answer_explanation.split("해설:")
            answer = answer.strip()
            explanation = explanation.strip()

            # 모델 마킹
            model = "gpt"

            # MySQL에 저장
            save_to_db(level, question, answer, explanation, model)
        else:
            print(f"Level {level} 문제 생성에 실패했습니다.")
