from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    PGHOST: str
    PGPORT: int
    PGDATABASE: str
    PGUSER: str
    PGPASSWORD: str

    APP_NAME: str
    APP_VERSION: str
    APP_HOST: str
    APP_PORT: int
    APP_DEBUG: bool = False

    FRONTEND_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        extra="ignore"
    )

settings = Settings()

# class Settings:
#     APP_NAME: str = os.getenv("APP_NAME", "Mario API")
#     APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
#     APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
#     APP_PORT: int = int(os.getenv("APP_PORT", "8000"))
#     APP_DEBUG: bool = os.getenv("APP_DEBUG", "false").lower() in ("1", "true", "yes")

#     PGHOST: str = os.getenv("PGHOST", "127.0.0.1")
#     PGPORT: int = int(os.getenv("PGPORT", "5432"))
#     PGDATABASE: str = os.getenv("PGDATABASE", "postgres")
#     PGUSER: str = os.getenv("PGUSER", "postgres")
#     PGPASSWORD: str = os.getenv("PGPASSWORD", "")