"""Configuration module for medical_rag."""

import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
CHROMA_DB_DIR = DATA_DIR / "chroma"

# Ensure data directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DB_DIR.mkdir(parents=True, exist_ok=True)


class Settings:
    """Application settings and environment parameters."""

    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    NCBI_EMAIL: str = os.getenv("NCBI_EMAIL", "medical-rag@example.com")
    NCBI_API_KEY: Optional[str] = os.getenv("NCBI_API_KEY", None)

    CHROMA_DB_DIR: Path = CHROMA_DB_DIR
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")

    DEFAULT_SEARCH_MAX_RESULTS: int = int(os.getenv("DEFAULT_SEARCH_MAX_RESULTS", "15"))
    RAG_TOP_K: int = int(os.getenv("RAG_TOP_K", "5"))


settings = Settings()
