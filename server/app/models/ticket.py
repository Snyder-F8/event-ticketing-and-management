import uuid
from .base import BaseModel
from app.extensions import db


class Payment(BaseModel):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id', ondelete='CASCADE'))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='pending')
    phone_number = db.Column(db.String(15))
    mpesa_code = db.Column(db.String(100))
    mpesa_checkout_request_id = db.Column(db.String(100))
    mpesa_merchant_request_id = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_id": self.ticket_id,
            "amount": float(self.amount),
            "status": self.status,
            "mpesa_code": self.mpesa_code,
            "created_at": str(self.created_at) if self.created_at else None,
        }


def _generate_ticket_code():
    return uuid.uuid4().hex[:10].upper()


class Ticket(BaseModel):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    ticket_code = db.Column(db.String(20), unique=True, default=_generate_ticket_code)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    ticket_type_id = db.Column(db.Integer, db.ForeignKey('ticket_types.id', ondelete='SET NULL'))
    quantity = db.Column(db.Integer, default=1)
    total_amount = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String(20), default='pending')

    # Relationships
    ticket_type = db.relationship('TicketType')
    payment = db.relationship('Payment', backref='ticket', uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_code": self.ticket_code,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "quantity": self.quantity,
            "total_amount": float(self.total_amount) if self.total_amount else None,
            "status": self.status,
            "ticket_type": self.ticket_type.to_dict() if self.ticket_type else None,
            "payment": self.payment.to_dict() if self.payment else None,
            "created_at": str(self.created_at) if self.created_at else None,
        }