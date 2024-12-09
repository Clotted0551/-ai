#Question: What is the purpose of interest rate futures contracts?
#A) To provide a way for investors to speculate on the future direction of interest rates
#B) To allow banks to hedge their interest rate risk
#C) To provide a way for the Federal Reserve to control the money supply
#D) To allow investors to make a profit from changes in interest rates

#Correct answer: B) To allow banks to hedge their interest rate risk

#Explanation: Interest rate futures contracts are designed to provide a way for banks and other financial institutions to manage their interest rate risk. By entering into a futures contract, these institutions can lock in a fixed interest rate for a future date, which can help them to manage their interest rate exposure and reduce their risk. This is the primary purpose of interest rate futures contracts, and it is why they are widely used in the financial industry.

import openai
import mysql.connector
from dotenv import load_dotenv
import os
import re

# .env 파일에서 API 키 불러오기
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# MySQL 연결 설정
def connect_to_db():
    return mysql.connector.connect(
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",
        user="admin",
        password="wkdalswns0551!",
        database="economy"
    )

# OpenAI를 통해 번역하는 함수
def translate_to_korean(text):
    prompt = f"Translate the following text to Korean:\n\n{text}"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional translator."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7
    )
    return response['choices'][0]['message']['content'].strip()

# A, B, C, D를 1, 2, 3, 4로 변환하는 함수
def convert_choices_format(choices):
    conversion_map = {"A)": "1.", "B)": "2.", "C)": "3.", "D)": "4."}
    for letter, number in conversion_map.items():
        choices = choices.replace(letter, number)
    return choices

# 데이터를 MySQL에 저장
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

# 정답 번호 변환 (e.g., "B)" → "2")
def extract_answer_number(correct_answer):
    match = re.search(r"[A-D]", correct_answer)
    if match:
        return {"A": "1", "B": "2", "C": "3", "D": "4"}[match.group()]
    else:
        raise ValueError(f"Invalid correct answer format: {correct_answer}")

# Ollama 결과를 GPT 문제 형식으로 변환
def process_ollama_result(level, ollama_output):
    # Ollama 출력 파싱
    lines = ollama_output.strip().split("\n")
    question = lines[0].replace("Question: ", "").strip()
    choices = "\n".join(lines[1:5])  # 선택지
    correct_answer = lines[5].replace("Correct answer: ", "").strip()
    explanation = " ".join(lines[6:]).replace("Explanation: ", "").strip()

    # 선택지 형식 변환 (A, B, C, D → 1, 2, 3, 4)
    converted_choices = convert_choices_format(choices)

    # 정답 번호 변환
    try:
        correct_answer_number = extract_answer_number(correct_answer)
    except ValueError as e:
        print(f"Error: {e}")
        return

    # 한국어 번역
    question_ko = translate_to_korean(question)
    choices_ko = translate_to_korean(converted_choices)
    explanation_ko = translate_to_korean(explanation)

    # GPT 형식으로 변환
    formatted_question = f"문제: {question_ko}\n{choices_ko}\n정답: {correct_answer_number}\n해설: {explanation_ko}"

    # MySQL 저장
    save_to_db(level, formatted_question, correct_answer_number, explanation_ko, "ollama")

# 메인 실행
if __name__ == "__main__":
    # 예시: Ollama 출력
    ollama_output = """
    Question: What is the purpose of interest rate futures contracts?
    A) To provide a way for investors to speculate on the future direction of interest rates
    B) To allow banks to hedge their interest rate risk
    C) To provide a way for the Federal Reserve to control the money supply
    D) To allow investors to make a profit from changes in interest rates

    Correct answer: B) To allow banks to hedge their interest rate risk

    Explanation: Interest rate futures contracts are designed to provide a way for banks and other financial institutions to manage their interest rate risk. By entering into a futures contract, these institutions can lock in a fixed interest rate for a future date, which can help them to manage their interest rate exposure and reduce their risk. This is the primary purpose of interest rate futures contracts, and it is why they are widely used in the financial industry.
    """

    # 레벨 입력
    input_level = int(input("Enter the difficulty level (1-5): "))
    process_ollama_result(input_level, ollama_output)
4

