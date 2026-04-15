import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///local.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret-change-in-production")
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

    # Resend
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


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_SECRET_KEY = "test-jwt-secret"
    SECRET_KEY = "test-secret"
    RESEND_API_KEY = "test-key"
    MPESA_CONSUMER_KEY = "test-key"
    MPESA_CONSUMER_SECRET = "test-secret"
    MPESA_SHORTCODE = "174379"
    MPESA_PASSKEY = "test-passkey"
    MPESA_CALLBACK_URL = "https://test.example.com/callback"