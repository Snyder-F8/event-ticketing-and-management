"""
Tests for all SQLAlchemy models and their relationships.
"""

import pytest
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.user import Role, User
from app.models.event import Event, TicketType, Image, event_categories
from app.models.ticket import Ticket, Payment
from app.models.category import Category


# ═══════════════════════════════════════════════════════════════════════
#  ROLE TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestRole:
    def test_create_role(self, db_session):
        """Role can be created and has correct __repr__."""
        role = Role(name="Admin")
        db_session.add(role)
        db_session.commit()

        assert role.id is not None
        assert role.name == "Admin"
        assert repr(role) == "<Role Admin>"

    def test_role_name_unique(self, db_session):
        """Duplicate role names raise IntegrityError."""
        db_session.add(Role(name="Admin"))
        db_session.commit()

        db_session.add(Role(name="Admin"))
        with pytest.raises(IntegrityError):
            db_session.commit()
        db_session.rollback()


# ═══════════════════════════════════════════════════════════════════════
#  USER TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestUser:
    def test_create_user(self, db_session, seed_roles):
        """User can be created with all required fields."""
        user = User(
            name="Jane Doe",
            email="jane@example.com",
            password=generate_password_hash("secret"),
            role_id=seed_roles["User"].id,
            is_verified=False,
            verification_token="abc123",
        )
        db_session.add(user)
        db_session.commit()

        assert user.id is not None
        assert user.name == "Jane Doe"
        assert user.email == "jane@example.com"
        assert user.is_verified is False
        assert user.verification_token == "abc123"

    def test_user_email_unique(self, db_session, seed_roles):
        """Duplicate emails raise IntegrityError."""
        db_session.add(User(
            name="First",
            email="dup@example.com",
            password="hash",
            role_id=seed_roles["User"].id,
        ))
        db_session.commit()

        db_session.add(User(
            name="Second",
            email="dup@example.com",
            password="hash",
            role_id=seed_roles["User"].id,
        ))
        with pytest.raises(IntegrityError):
            db_session.commit()
        db_session.rollback()

    def test_user_role_relationship(self, db_session, seed_roles):
        """user.role and role.users bidirectional relationship works."""
        user = User(
            name="Bob",
            email="bob@example.com",
            password="hash",
            role_id=seed_roles["Organizer"].id,
        )
        db_session.add(user)
        db_session.commit()

        assert user.role.name == "Organizer"
        assert user in seed_roles["Organizer"].users

    def test_user_created_at_auto(self, db_session, seed_roles):
        """created_at is auto-populated after commit."""
        user = User(
            name="Ts",
            email="ts@example.com",
            password="hash",
            role_id=seed_roles["User"].id,
        )
        db_session.add(user)
        db_session.commit()

        refreshed = db_session.get(User, user.id)
        assert refreshed.created_at is not None


# ═══════════════════════════════════════════════════════════════════════
#  EVENT TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestEvent:
    def _make_organizer(self, db_session, seed_roles):
        user = User(
            name="Org",
            email="org@example.com",
            password="hash",
            role_id=seed_roles["Organizer"].id,
            is_verified=True,
        )
        db_session.add(user)
        db_session.commit()
        return user

    def test_create_event(self, db_session, seed_roles):
        """Event can be created and links to its organizer."""
        organizer = self._make_organizer(db_session, seed_roles)
        event = Event(
            title="Tech Summit",
            description="A tech conference",
            location="Nairobi",
            event_date=datetime(2026, 6, 15, tzinfo=timezone.utc),
            organizer_id=organizer.id,
        )
        db_session.add(event)
        db_session.commit()

        assert event.id is not None
        assert event.organizer.name == "Org"
        assert event in organizer.events_organized

    def test_event_ticket_types(self, db_session, seed_roles):
        """TicketTypes are linked to their parent Event."""
        organizer = self._make_organizer(db_session, seed_roles)
        event = Event(
            title="Music Fest",
            event_date=datetime(2026, 7, 1, tzinfo=timezone.utc),
            organizer_id=organizer.id,
        )
        db_session.add(event)
        db_session.commit()

        vip = TicketType(event_id=event.id, name="VIP", price=Decimal("5000.00"), quantity=50)
        regular = TicketType(event_id=event.id, name="Regular", price=Decimal("1000.00"), quantity=200)
        db_session.add_all([vip, regular])
        db_session.commit()

        assert len(event.ticket_types) == 2
        assert {t.name for t in event.ticket_types} == {"VIP", "Regular"}

    def test_event_images(self, db_session, seed_roles):
        """Images are linked to their parent Event."""
        organizer = self._make_organizer(db_session, seed_roles)
        event = Event(
            title="Art Expo",
            event_date=datetime(2026, 8, 1, tzinfo=timezone.utc),
            organizer_id=organizer.id,
        )
        db_session.add(event)
        db_session.commit()

        img = Image(event_id=event.id, image_url="https://example.com/img.jpg")
        db_session.add(img)
        db_session.commit()

        assert len(event.images) == 1
        assert event.images[0].image_url == "https://example.com/img.jpg"

    def test_event_categories_many_to_many(self, db_session, seed_roles):
        """Events and Categories have a working many-to-many relationship."""
        organizer = self._make_organizer(db_session, seed_roles)
        cat_music = Category(name="Music")
        cat_tech = Category(name="Tech")
        db_session.add_all([cat_music, cat_tech])
        db_session.commit()

        event = Event(
            title="Hybrid Event",
            event_date=datetime(2026, 9, 1, tzinfo=timezone.utc),
            organizer_id=organizer.id,
        )
        event.categories.extend([cat_music, cat_tech])
        db_session.add(event)
        db_session.commit()

        assert len(event.categories) == 2
        assert event in cat_music.events
        assert event in cat_tech.events

    def test_event_cascade_delete(self, db_session, seed_roles):
        """Deleting an event cascades to ticket_types, images, and tickets."""
        organizer = self._make_organizer(db_session, seed_roles)

        event = Event(
            title="Temp Event",
            event_date=datetime(2026, 10, 1, tzinfo=timezone.utc),
            organizer_id=organizer.id,
        )
        db_session.add(event)
        db_session.commit()

        tt = TicketType(event_id=event.id, name="GA", price=Decimal("500.00"), quantity=100)
        img = Image(event_id=event.id, image_url="https://example.com/x.jpg")
        db_session.add_all([tt, img])
        db_session.commit()

        ticket = Ticket(event_id=event.id, user_id=organizer.id, ticket_type_id=tt.id)
        db_session.add(ticket)
        db_session.commit()

        event_id = event.id
        db_session.delete(event)
        db_session.commit()

        assert db_session.get(Event, event_id) is None
        assert TicketType.query.filter_by(event_id=event_id).count() == 0
        assert Image.query.filter_by(event_id=event_id).count() == 0
        assert Ticket.query.filter_by(event_id=event_id).count() == 0


# ═══════════════════════════════════════════════════════════════════════
#  TICKET & PAYMENT TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestTicketAndPayment:
    def test_create_ticket(self, db_session, seed_roles):
        """Ticket can be created with proper foreign keys."""
        user = User(name="Buyer", email="buyer@example.com", password="h",
                     role_id=seed_roles["User"].id, is_verified=True)
        db_session.add(user)
        db_session.commit()

        organizer = User(name="Org2", email="org2@example.com", password="h",
                          role_id=seed_roles["Organizer"].id, is_verified=True)
        db_session.add(organizer)
        db_session.commit()

        event = Event(title="E", event_date=datetime(2026, 12, 1, tzinfo=timezone.utc),
                      organizer_id=organizer.id)
        db_session.add(event)
        db_session.commit()

        tt = TicketType(event_id=event.id, name="Std", price=Decimal("200"), quantity=10)
        db_session.add(tt)
        db_session.commit()

        ticket = Ticket(event_id=event.id, user_id=user.id, ticket_type_id=tt.id, status="confirmed")
        db_session.add(ticket)
        db_session.commit()

        assert ticket.id is not None
        assert ticket.status == "confirmed"
        assert ticket.event.title == "E"
        assert ticket.ticket_type.name == "Std"
        assert ticket in user.tickets_purchased

    def test_create_payment(self, db_session, seed_roles):
        """Payment is linked one-to-one with a Ticket."""
        user = User(name="Payer", email="payer@example.com", password="h",
                     role_id=seed_roles["User"].id, is_verified=True)
        db_session.add(user)
        db_session.commit()

        organizer = User(name="Org3", email="org3@example.com", password="h",
                          role_id=seed_roles["Organizer"].id, is_verified=True)
        db_session.add(organizer)
        db_session.commit()

        event = Event(title="Pay Event", event_date=datetime(2026, 12, 1, tzinfo=timezone.utc),
                      organizer_id=organizer.id)
        db_session.add(event)
        db_session.commit()

        tt = TicketType(event_id=event.id, name="GA", price=Decimal("1500"), quantity=50)
        db_session.add(tt)
        db_session.commit()

        ticket = Ticket(event_id=event.id, user_id=user.id, ticket_type_id=tt.id)
        db_session.add(ticket)
        db_session.commit()

        payment = Payment(
            ticket_id=ticket.id,
            amount=Decimal("1500.00"),
            status="completed",
            mpesa_code="QWE123ABC",
        )
        db_session.add(payment)
        db_session.commit()

        assert payment.id is not None
        assert ticket.payment is not None
        assert ticket.payment.mpesa_code == "QWE123ABC"
        assert ticket.payment.status == "completed"


# ═══════════════════════════════════════════════════════════════════════
#  CATEGORY TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestCategory:
    def test_create_category(self, db_session):
        """Category can be created."""
        cat = Category(name="Sports")
        db_session.add(cat)
        db_session.commit()

        assert cat.id is not None
        assert cat.name == "Sports"

    def test_category_name_unique(self, db_session):
        """Duplicate category names raise IntegrityError."""
        db_session.add(Category(name="Sports"))
        db_session.commit()

        db_session.add(Category(name="Sports"))
        with pytest.raises(IntegrityError):
            db_session.commit()
        db_session.rollback()
