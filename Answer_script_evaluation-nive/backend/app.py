from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import evaluation
from routers import faculty
from database.database import engine
from models.evaluation import Base
from routers import dashboard
from routers import websocket
from routers import history
from routers import excel
from routers import student


app = FastAPI(
    title="Automated Answer Script Evaluation API",
    version="1.0.0",
    description="Backend API for AI-based Answer Script Evaluation"
)

import os

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:5173",
        "https://answer-script-evaluation-rose.vercel.app"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(evaluation.router)
app.include_router(faculty.router)
app.include_router(dashboard.router)
app.include_router(websocket.router)
app.include_router(history.router)
app.include_router(excel.router)
app.include_router(student.router)

@app.get("/")
def root():
    return {
        "message": "Automated Answer Script Evaluation API Running 🚀"
    }