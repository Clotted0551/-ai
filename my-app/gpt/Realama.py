import mysql.connector
import subprocess
import re

# MySQL 연결 함수
def connect_to_db():
    print("Connecting to database...")
    return mysql.connector.connect(
        host="database-1.c94qw4eqglka.ap-northeast-2.rds.amazonaws.com",
        user="admin",
        password="wkdalswns0551!",
        database="economy"
    )

# MySQL 데이터 저장 함수
def save_to_db(level, question, answer, explanation, model):
    print(f"Saving level {level} data to database...")
    connection = connect_to_db()
    cursor = connection.cursor()
    try:
        query = "INSERT INTO quiz (quiz_level, quiz_question, quiz_answer, quiz_comment, quiz_category) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (level, question, answer, explanation, model))
        connection.commit()
        print(f"Level {level} data saved successfully!")
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        connection.rollback()  # 문제 발생 시 롤백
        raise e
    finally:
        cursor.close()
        connection.close()

# 로컬 Ollama 모델을 호출하여 퀴즈 문제를 생성하는 함수
def generate_economic_question(level):
    print(f"Generating economic question for level {level}...")
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
    
    퀴즈는 한 개만 생성해주세요.
    """

    try:
        # 커맨드라인 명령어로 Ollama 모델 호출
        print("Calling Ollama model...")
        result = subprocess.run(
            ["ollama", "run", "EEVE-Korean-10.8B:latest", prompt],
            capture_output=True,
            text=True,
            check=True
        )

        # 응답 결과
        response_text = result.stdout.strip()
        if not response_text:
            print("Error: No response from the Ollama model.")
            return None

        print("Ollama model response received.")
        return response_text

    except subprocess.CalledProcessError as e:
        print(f"Error while calling Ollama model: {e}")
        return None

# 퀴즈 문제 생성 및 MySQL에 저장
def create_and_save_quiz(level):
    print(f"Creating and saving quiz for level {level}...")
    try:
        # 퀴즈 데이터 생성
        quiz_data = generate_economic_question(level)
        if quiz_data is None:
            print("Failed to generate quiz data.")
            return

        # 정규 표현식을 사용해 문제, 선택지, 정답, 해설 추출
        question_match = re.search(r'문제:\s*(.+?)(?=\n1\.)', quiz_data, re.DOTALL)
        options_matches = re.findall(r'(\d+\.\s*.+?)(?=\n\d+\.|\n정답:)', quiz_data)
        answer_match = re.search(r'정답:\s*(\d+)', quiz_data)
        explanation_match = re.search(r'해설:\s*(.+)', quiz_data, re.DOTALL)

        # 추출된 데이터 검증
        if not all([question_match, options_matches, answer_match, explanation_match]):
            print("Error: Unable to parse quiz components")
            print(f"Raw data: {quiz_data}")
            return

        question = question_match.group(1).strip()

        # 슬라이싱: 선택지 1, 2, 3, 4를 분리
        options = [opt.strip() for opt in options_matches]  # 각 선지를 개별적으로 저장

        answer = answer_match.group(1).strip()
        explanation = explanation_match.group(1).strip()

        # 문제와 선택지 결합 (선지 번호를 포함해서)
        formatted_question = f"{question}\n" + "\n".join(options)

        print(f"Formatted question for saving: {formatted_question}")
        print(f"Answer: {answer}")
        print(f"Explanation: {explanation}")

        # MySQL 저장
        save_to_db(level, formatted_question, answer, explanation, "ollama")

        print(f"Quiz for level {level} created and saved.")
        return {
            "level": level,
            "question": formatted_question,
            "answer": answer,
            "explanation": explanation
        }
    except Exception as e:
        print(f"Error creating and saving quiz: {e}")
        import traceback
        traceback.print_exc()

# 퀴즈 문제 5개씩 레벨 1부터 5까지 생성
for level in range(1, 6):  # 레벨 1부터 5까지
    for _ in range(5):    # 각 레벨에서 5개의 퀴즈 생성
        create_and_save_quiz(level)
