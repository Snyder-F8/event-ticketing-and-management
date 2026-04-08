"""
Unit tests for app.services.auth_service functions.

These tests call the service functions directly (no HTTP layer)
inside the Flask application context.
"""

import pytest
from app.services.auth_service import register_user, login_user, verify_email, get_all_users
from app.models.user import User


class TestRegisterUser:
    def test_register_success(self, app, seed_roles):
        """Successful registration returns 201 with user data and token."""
        with app.app_context():
            result, status = register_user("Alice", "alice@example.com", "strongpass", "User")

        assert status == 201
        assert result["message"] == "Registration successful. Please verify your email."
        assert result["user"]["name"] == "Alice"
        assert result["user"]["email"] == "alice@example.com"
        assert result["user"]["role"] == "User"
        assert result["user"]["is_verified"] is False
        assert "verification_token" in result

    def test_register_duplicate_email(self, app, seed_roles):
        """Registering with an existing email returns 409."""
        with app.app_context():
            register_user("First", "dup@example.com", "password1", "User")
            result, status = register_user("Second", "dup@example.com", "password2", "User")

        assert status == 409
        assert "already exists" in result["error"]

    def test_register_invalid_role(self, app, seed_roles):
        """Registering with a non-existent role returns 400."""
        with app.app_context():
            result, status = register_user("Fail", "fail@example.com", "password", "SuperAdmin")

        assert status == 400
        assert "does not exist" in result["error"]


class TestLoginUser:
    def test_login_success(self, app, sample_user):
        """Verified user can log in and receives a JWT."""
        with app.app_context():
            result, status = login_user("testuser@example.com", "password123")

        assert status == 200
        assert result["message"] == "Login successful."
        assert "access_token" in result
        assert result["user"]["email"] == "testuser@example.com"

    def test_login_wrong_password(self, app, sample_user):
        """Wrong password returns 401."""
        with app.app_context():
            result, status = login_user("testuser@example.com", "wrongpass")

        assert status == 401
        assert "Invalid" in result["error"]

    def test_login_nonexistent_email(self, app, seed_roles):
        """Non-existent email returns 401."""
        with app.app_context():
            result, status = login_user("nobody@example.com", "whatever")

        assert status == 401
        assert "Invalid" in result["error"]

    def test_login_unverified_user(self, app, db_session, seed_roles):
        """Unverified user receives 403."""
        with app.app_context():
            # Register but don't verify
            register_user("Unv", "unv@example.com", "password123", "User")
            result, status = login_user("unv@example.com", "password123")

        assert status == 403
        assert "verify" in result["error"].lower()


class TestVerifyEmail:
    def test_verify_email_success(self, app, db_session, seed_roles):
        """Valid token verifies the user and clears the token."""
        with app.app_context():
            reg_result, _ = register_user("Ver", "ver@example.com", "password123", "User")
            token = reg_result["verification_token"]

            result, status = verify_email(token)

            assert status == 200
            assert "verified successfully" in result["message"]

            # Confirm DB state
            user = User.query.filter_by(email="ver@example.com").first()
            assert user.is_verified is True
            assert user.verification_token is None

    def test_verify_email_invalid_token(self, app, seed_roles):
        """Invalid token returns 400."""
        with app.app_context():
            result, status = verify_email("this-is-a-bogus-token")

        assert status == 400
        assert "Invalid" in result["error"]


class TestGetAllUsers:
    def test_get_all_users(self, app, sample_user, admin_user):
        """Returns all users with correct shape."""
        with app.app_context():
            result, status = get_all_users()

        assert status == 200
        assert result["total"] >= 2
        user_emails = [u["email"] for u in result["users"]]
        assert "testuser@example.com" in user_emails
        assert "admin@example.com" in user_emails

        # Verify shape of each user dict
        for user in result["users"]:
            assert "id" in user
            assert "name" in user
            assert "email" in user
            assert "role" in user
            assert "is_verified" in user
            assert "created_at" in user
