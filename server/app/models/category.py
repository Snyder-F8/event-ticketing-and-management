from .base import BaseModel
from app import db


class Category(BaseModel):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    # Relationship
    events = db.relationship('Event', secondary='event_categories', back_populates='categories')