from .base import BaseModel
from app.extensions import db
import uuid


class Payment(BaseModel):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id', ondelete='CASCADE'))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default='pending')
    mpesa_code = db.Column(db.String(100))
    mpesa_checkout_request_id = db.Column(db.String(200))
    mpesa_merchant_request_id = db.Column(db.String(200))

    def to_dict(self):
        return {
            "id": self.id,
            "amount": float(self.amount),
            "phone_number": self.phone_number,
            "status": self.status,
            "mpesa_code": self.mpesa_code,
            "created_at": (
                self.created_at.strftime("%B %d, %Y at %I:%M %p")
                if self.created_at else None
            ),
        }


class Ticket(BaseModel):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    ticket_code = db.Column(
        db.String(20), unique=True, nullable=False,
        default=lambda: str(uuid.uuid4()).upper()[:12]
    )
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    ticket_type_id = db.Column(
        db.Integer, db.ForeignKey('ticket_types.id', ondelete='SET NULL')
    )
    quantity = db.Column(db.Integer, nullable=False, default=1)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    status = db.Column(db.String(20), default='pending')

    ticket_type = db.relationship('TicketType')
    payment = db.relationship('Payment', backref='ticket', uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_code": self.ticket_code,
            "event": {
                "id": self.event.id,
                "title": self.event.title,
                "location": self.event.location,
                "event_date": (
                    self.event.event_date.strftime("%B %d, %Y at %I:%M %p")
                    if self.event.event_date else None
                ),
            } if self.event else None,
            "ticket_type": self.ticket_type.to_dict() if self.ticket_type else None,
            "quantity": self.quantity,
            "total_amount": float(self.total_amount),
            "status": self.status,
            "event_title": self.event.title if self.event else "Unknown Event",
            "ticket_type_name": self.ticket_type.name if self.ticket_type else "General",
            "user_name": self.user.name if self.user else "Anonymous",
            "user_email": self.user.email if self.user else "N/A",
            "payment": self.payment.to_dict() if self.payment else None,
            "purchased_at": (
                self.created_at.strftime("%B %d, %Y at %I:%M %p")
                if self.created_at else None
            ),
        }