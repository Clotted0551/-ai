import time
import requests
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# MySQL 연결 설정
def connect_to_db():
    return mysql.connector.connect(
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",
        user="admin",
        password="wkdalswns0551!",
        database="economy"
    )

# Hugging Face에서 Ollama 모델 호출
def get_ollama_response(level, max_retries=5):
    url = "https://api-inference.huggingface.co/models/ohriyang/em"
    headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}
    prompt = f"""
    If the problem difficulty ranges from 1 to 5, please create an economics quiz appropriate for the level {level}. 
    Each question must be written as a four-choice, multiple-choice question and must include the correct answer and explanation. 
    The format is:
    Problem: [Problem details]
    1. [Prophet 1]
    2. [Prophet 2]
    3. [Prophet 3]
    4. [Prophet 4]
    Correct answer: [Correct answer number]
    Explanation: [Reason for correct answer]
    """

    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json={"inputs": prompt})
        
        if response.status_code == 200:
            return response.json()["generated_text"]
        elif response.status_code == 503:
            error_data = response.json()
            estimated_time = error_data.get("estimated_time", 10)  # 기본 대기 시간 10초
            print(f"Model is loading. Retrying in {estimated_time} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(estimated_time)
        else:
            raise Exception(f"Failed to fetch response: {response.status_code}, {response.text}")
    
    raise Exception("Exceeded maximum retries while waiting for the model to load.")

# Google 번역 API 호출
def translate_text(text, target_language="ko"):
    translate_url = "https://translation.googleapis.com/language/translate/v2"
    api_key = os.getenv("GOOGLE_API_KEY")
    params = {
        'key': api_key,
        'q': text,
        'target': target_language,
        'source': 'en'
    }
    response = requests.post(translate_url, params=params)
    if response.status_code == 200:
        return response.json()['data']['translations'][0]['translatedText']
    else:
        raise Exception(f"Translation failed: {response.status_code}, {response.text}")

# MySQL에 데이터 저장
def save_to_db(level, question, answer, explanation, model):
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
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
    for level in range(1, 6):  # 난이도 1~5 문제 생성
        try:
            # Ollama 모델 호출
            response_text = get_ollama_response(level)

            # Ollama 응답에서 문제/정답/해설 추출
            if "Problem:" in response_text and "Correct answer:" in response_text:
                question_and_choices, answer_explanation = response_text.split("Correct answer:")
                question = question_and_choices.replace("Problem:", "").strip()
                answer, explanation = answer_explanation.split("Explanation:")
                answer = answer.strip()
                explanation = explanation.strip()

                # Google 번역 API 호출
                translated_question = translate_text(question)
                translated_answer = translate_text(answer)
                translated_explanation = translate_text(explanation)

                # MySQL에 저장
                save_to_db(level, translated_question, translated_answer, translated_explanation, "ollama")
            else:
                print(f"Failed to parse response for level {level}: {response_text}")
        except Exception as e:
            print(f"Error processing level {level}: {e}")
