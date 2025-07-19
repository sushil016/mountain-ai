"""
Simple test version of the FastAPI app to debug issues.
"""
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Test API")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("test_main:app", host="0.0.0.0", port=8000, reload=True)
