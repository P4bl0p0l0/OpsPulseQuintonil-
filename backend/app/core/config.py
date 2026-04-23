from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "OpsPulseQuintonil API"
    ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    DATABASE_URL: str
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()