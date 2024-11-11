from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

# 사용자 레벨에 맞는 경제 문제 생성하는 함수
def generate_problem(level: int):
    # Ollama 모델에 보낼 프롬프트 구성
    prompt = f"사용자가 레벨 {level}에 해당하는 경제 문제를 4지선다 형식으로 만들어줘. 문제와 4개의 선택지(정답 포함)를 제공해줘."
    
    # Ollama API 호출 (가정: Ollama API 엔드포인트 사용)
    response = requests.post(
        "http://localhost:5000/v1/ollama/generate",  # Ollama API 엔드포인트 예시
        json={"prompt": prompt, "max_tokens": 150}
    )
    
    if response.status_code == 200:
        result = response.json()
        problem = result.get("text", "").strip()
        return problem
    else:
        return "문제를 생성할 수 없습니다."

# 사용자 레벨을 받아 문제를 반환하는 엔드포인트
class LevelRequest(BaseModel):
    level: int

@app.post("/api/get_problem")
async def get_problem(level_request: LevelRequest):
    level = level_request.level
    problem = generate_problem(level)
    return {"problem": problem}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
