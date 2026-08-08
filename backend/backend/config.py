import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENV: str = "development"

    # Relative or absolute model paths
    RISK_MODEL_PATH: str = "saved_models/risk_model.joblib"
    REVIEW_MODEL_PATH: str = "saved_models/review_model.joblib"
    COUNTERFEIT_MODEL_PATH: str = "saved_models/counterfeit_model.pth"
    COUNTERFEIT_TABULAR_MODEL_PATH: str = "saved_models/counterfeit_model.joblib"

    DATASETS_DIR: str = "datasets"
    UPLOADS_DIR: str = "uploads"
    AUDIT_LOG_PATH: str = "data/audit_logs.json"
    ANALYTICS_DATA_PATH: str = "data/analytics.json"

    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5175,http://localhost:4173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    def get_absolute_path(self, relative_path: str) -> Path:
        p = Path(relative_path)
        if p.is_absolute():
            return p
        return BASE_DIR / p

settings = Settings()

# Ensure standard directories exist
for dir_path in [
    settings.get_absolute_path("saved_models"),
    settings.get_absolute_path(settings.DATASETS_DIR),
    settings.get_absolute_path(settings.UPLOADS_DIR),
    settings.get_absolute_path("data"),
]:
    dir_path.mkdir(parents=True, exist_ok=True)
