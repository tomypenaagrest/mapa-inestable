from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/mapainestable"
    secret_key: str = "dev-secret-key"
    environment: str = "development"
    cors_origins: list = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
