from sqlalchemy import Index
from .base import BaseModel
from app.extensions import db


# Many-to-many association table (put here because it's event-related)
event_categories = db.Table(
    'event_categories',
    db.metadata,
    db.Column('event_id', db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)


class TicketType(BaseModel):
    __tablename__ = 'ticket_types'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'))
    name = db.Column(db.String(50), nullable=False)   # Early Bird, VIP, Regular
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    tickets_sold = db.Column(db.Integer, default=0)

    @property
    def tickets_remaining(self):
        return self.quantity - (self.tickets_sold or 0)

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "name": self.name,
            "price": float(self.price),
            "quantity": self.quantity,
            "tickets_sold": self.tickets_sold or 0,
            "tickets_remaining": self.tickets_remaining,
        }


class Image(BaseModel):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'))
    image_url = db.Column(db.String(255), nullable=False)


class Event(BaseModel):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(150))
    event_date = db.Column(db.TIMESTAMP, nullable=False)
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    status = db.Column(db.String(20), default='pending')

    # Indexes
    __table_args__ = (
        Index('idx_events_location', 'location'),
        Index('idx_events_date', 'event_date'),
    )

    # Relationships
    ticket_types = db.relationship('TicketType', backref='event', cascade='all, delete-orphan')
    tickets = db.relationship('Ticket', backref='event', cascade='all, delete-orphan')
    categories = db.relationship('Category', secondary=event_categories, back_populates='events')
    images = db.relationship('Image', backref='event', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "organizer_id": self.organizer_id,
            "status": self.status,
            "categories": [c.name for c in self.categories],
            "ticket_types": [t.to_dict() for t in self.ticket_types],
            "images": [img.image_url for img in self.images],
            "created_at": str(self.created_at) if self.created_at else None,
        }