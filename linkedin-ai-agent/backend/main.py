from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generate, refine

app = FastAPI(title="LinkedIn AI Agent", version="1.0.0")

import os

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(refine.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "LinkedIn AI Agent is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
