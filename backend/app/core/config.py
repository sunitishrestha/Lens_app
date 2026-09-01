from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://joblens:joblens_dev_password@db:5432/joblens"
    jwt_secret: str = "joblens-local-development-secret-change-before-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days for dev
    allowed_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()