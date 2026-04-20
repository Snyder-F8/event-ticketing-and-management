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
    db_url = os.environ.get("DATABASE_URL")

    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set. "
                        "Please add it in Render Dashboard > Environment.")

    # Render sometimes gives "postgres://" but SQLAlchemy requires "postgresql://"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Recommended for Render (prevents stale connection issues)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_timeout": 30,
    }

    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    # ==================== EMAIL CONFIG ====================
    # Email Configuration (SMTP)
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() == "true"
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER")

    # Resend (Keep for now as fallback or until fully removed)
    # RESEND_API_KEY = os.environ.get("RESEND_API_KEY")

    # # Safe default for testing (works without domain verification)
    # RESEND_FROM_EMAIL = os.environ.get(
    #     "RESEND_FROM_EMAIL", 
    #     "TicketVibez <onboarding@resend.dev>"
    # )

    # Frontend URL - VERY IMPORTANT for verification & reset links
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL = os.environ.get("VITE_API_BASE_URL", "http://localhost:5000")

    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL = os.environ.get("VITE_API_BASE_URL", "http://localhost:5000")


    # M-Pesa
    MPESA_CONSUMER_KEY = os.environ.get("MPESA_CONSUMER_KEY")
    MPESA_CONSUMER_SECRET = os.environ.get("MPESA_CONSUMER_SECRET")
    MPESA_SHORTCODE = os.environ.get("MPESA_SHORTCODE", "174379")
    MPESA_PASSKEY = os.environ.get("MPESA_PASSKEY")
    MPESA_CALLBACK_URL = os.environ.get("MPESA_CALLBACK_URL")

    # # Optional: Warn if Resend is not fully configured
    # @classmethod
    # def check_email_config(cls):
    #     if not cls.RESEND_API_KEY:
    #         print("WARNING: RESEND_API_KEY is not set. Emails will not be sent.")
    #     if "onboarding@resend.dev" in cls.RESEND_FROM_EMAIL and not os.environ.get("RESEND_FROM_EMAIL"):
    #         print("Using Resend default sender (onboarding@resend.dev). Good for testing.")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    # Force production frontend URL (optional but recommended)
    FRONTEND_URL = os.environ.get("FRONTEND_URL")


class TestingConfig(Config):
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}
    # Suppress emails during tests
    RESEND_API_KEY = "test-key-only"
    FRONTEND_URL = "http://localhost:5173"