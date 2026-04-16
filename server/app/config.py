import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Security
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in environment variables")
    if not JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY is not set in environment variables")

    # ==================== DATABASE CONFIG ====================
    # Get DATABASE_URL from Render environment
    db_url = os.environ.get("DATABASE_URL")

    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set. "
                        "Please add it in Render Dashboard > Environment.")

    # Render sometimes gives "postgres://" but SQLAlchemy 1.4+ requires "postgresql://"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Recommended for Render (helps prevent stale connection errors)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,      # Tests connection before using it
        "pool_recycle": 300,        # Recycle connections every 5 minutes
        "pool_timeout": 30,
    }

    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

    # Resend (Email)
    RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
    RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    # M-Pesa
    MPESA_CONSUMER_KEY = os.environ.get("MPESA_CONSUMER_KEY")
    MPESA_CONSUMER_SECRET = os.environ.get("MPESA_CONSUMER_SECRET")
    MPESA_SHORTCODE = os.environ.get("MPESA_SHORTCODE", "174379")
    MPESA_PASSKEY = os.environ.get("MPESA_PASSKEY")
    MPESA_CALLBACK_URL = os.environ.get("MPESA_CALLBACK_URL")


class DevelopmentConfig(Config):
    DEBUG = True
    # Optional: You can force a local DB here if needed for pure local testing
    # SQLALCHEMY_DATABASE_URI = "sqlite:///instance/dev.db"


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    DEBUG = False
    # Use in-memory SQLite for tests (fast & isolated)
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}   # No pooling needed for tests
