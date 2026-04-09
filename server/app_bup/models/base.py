from app import db
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

class BaseModel(db.Model):
    """Base model with common fields"""
    __abstract__ = True   # This tells SQLAlchemy not to create a table for this class

    created_at = db.Column(TIMESTAMP, server_default=func.current_timestamp())