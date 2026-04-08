"""
Shared pytest fixtures for the event-ticketing test suite.

Compatible with Flask-SQLAlchemy 3.x which removed create_scoped_session.
Each test gets a clean database by dropping and recreating all tables.
"""

import pytest
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

from app import create_app
from app.config import TestingConfig
from app.extensions import db as _db
from app.models.user import Role, User


# ── App (session-scoped — created once) ─────────────────────────────

@pytest.fixture(scope="session")
def app():
    """Create the Flask application with testing config."""
    app = create_app(TestingConfig)
    yield app


# ── Per-test clean database ─────────────────────────────────────────

@pytest.fixture(autouse=True)
def db_session(app):
    """
    Create fresh tables before each test and drop them after.
    This ensures each test starts with a completely clean database.
    """
    with app.app_context():
        _db.create_all()
        yield _db.session
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app):
    """Flask test client for HTTP-level tests."""
    return app.test_client()


# ── Seed helpers ────────────────────────────────────────────────────

@pytest.fixture()
def seed_roles(db_session):
    """Seed the three application roles and return them as a dict."""
    roles = {}
    for name in ("Admin", "Organizer", "User"):
        role = Role(name=name)
        db_session.add(role)
        roles[name] = role
    db_session.commit()
    return roles


@pytest.fixture()
def sample_user(db_session, seed_roles):
    """Create and return a verified regular user."""
    user = User(
        name="Test User",
        email="testuser@example.com",
        password=generate_password_hash("password123"),
        role_id=seed_roles["User"].id,
        is_verified=True,
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture()
def admin_user(db_session, seed_roles):
    """Create and return a verified admin user."""
    user = User(
        name="Admin User",
        email="admin@example.com",
        password=generate_password_hash("admin123"),
        role_id=seed_roles["Admin"].id,
        is_verified=True,
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture()
def admin_token(app, admin_user):
    """Return a valid JWT for the admin user."""
    with app.app_context():
        return create_access_token(
            identity=str(admin_user.id),
            additional_claims={
                "role": "Admin",
                "email": admin_user.email,
            },
        )


@pytest.fixture()
def user_token(app, sample_user):
    """Return a valid JWT for a regular user."""
    with app.app_context():
        return create_access_token(
            identity=str(sample_user.id),
            additional_claims={
                "role": "User",
                "email": sample_user.email,
            },
        )
