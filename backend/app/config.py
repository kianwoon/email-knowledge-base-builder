from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Debug mode
    DEBUG: bool = False

    # JWT settings
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Microsoft Graph API settings
    MS_CLIENT_ID: str
    MS_TENANT_ID: str
    MS_CLIENT_SECRET: str
    MS_REDIRECT_URI: str
    MS_SCOPES: list = [
        "User.Read",
        "Mail.Read",
        "Mail.ReadWrite",
        "offline_access"
    ]

    # URLs
    FRONTEND_URL: str
    BACKEND_URL: str

    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = None

    # Deployment settings
    IS_KOYEB: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()