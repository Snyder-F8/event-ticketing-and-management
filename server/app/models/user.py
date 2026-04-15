from sqlalchemy import Index
from .base import BaseModel
from app import db

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Role {self.name}>'


class User(BaseModel):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='SET NULL'))
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(255))
    reset_password_token = db.Column(db.String(255))
    reset_password_expires = db.Column(db.DateTime)

    # Indexes
    __table_args__ = (
        Index('idx_users_email', 'email'),
    )

    # Relationships
    role = db.relationship('Role', backref='users')
    events_organized = db.relationship('Event', backref='organizer', lazy=True)
    tickets_purchased = db.relationship('Ticket', backref='user', lazy=True)