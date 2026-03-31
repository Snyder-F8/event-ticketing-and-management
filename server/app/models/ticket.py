from .base import BaseModel
from app import db


class Payment(BaseModel):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id', ondelete='CASCADE'))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='pending')
    mpesa_code = db.Column(db.String(100))


class Ticket(BaseModel):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    ticket_type_id = db.Column(db.Integer, db.ForeignKey('ticket_types.id', ondelete='SET NULL'))
    status = db.Column(db.String(20), default='pending')

    # Relationships
    ticket_type = db.relationship('TicketType')
    payment = db.relationship('Payment', backref='ticket', uselist=False)