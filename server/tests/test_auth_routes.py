"""
Integration tests for the /auth blueprint endpoints.

These tests use the Flask test client to send real HTTP requests
through the full request/response cycle.
"""

import pytest
from app.services.auth_service import register_user


# ═══════════════════════════════════════════════════════════════════════
#  POST /auth/register
# ═══════════════════════════════════════════════════════════════════════

class TestRegisterEndpoint:
    def test_register_success(self, client, seed_roles):
        """POST /auth/register with valid data returns 201."""
        resp = client.post("/auth/register", json={
            "name": "New User",
            "email": "new@example.com",
            "password": "securepass",
            "role": "User",
        })

        assert resp.status_code == 201
        data = resp.get_json()
        assert data["user"]["email"] == "new@example.com"
        assert "verification_token" in data

    def test_register_missing_fields(self, client, seed_roles):
        """POST /auth/register without required fields returns 400."""
        resp = client.post("/auth/register", json={
            "name": "Incomplete",
        })

        assert resp.status_code == 400
        assert "required" in resp.get_json()["error"].lower()

    def test_register_short_password(self, client, seed_roles):
        """POST /auth/register with password < 6 chars returns 400."""
        resp = client.post("/auth/register", json={
            "name": "Short",
            "email": "short@example.com",
            "password": "12345",
            "role": "User",
        })

        assert resp.status_code == 400
        assert "6 characters" in resp.get_json()["error"]

    def test_register_no_json_body(self, client, seed_roles):
        """POST /auth/register without JSON content-type returns 415."""
        resp = client.post("/auth/register", data="not json",
                           content_type="text/plain")

        assert resp.status_code == 415

    def test_register_duplicate_email(self, client, seed_roles):
        """POST /auth/register with existing email returns 409."""
        payload = {
            "name": "First",
            "email": "dupe@example.com",
            "password": "password1",
            "role": "User",
        }
        client.post("/auth/register", json=payload)

        resp = client.post("/auth/register", json={
            "name": "Second",
            "email": "dupe@example.com",
            "password": "password2",
            "role": "User",
        })

        assert resp.status_code == 409


# ═══════════════════════════════════════════════════════════════════════
#  POST /auth/login
# ═══════════════════════════════════════════════════════════════════════

class TestLoginEndpoint:
    def test_login_success(self, client, sample_user):
        """POST /auth/login with valid credentials returns 200 and a token."""
        resp = client.post("/auth/login", json={
            "email": "testuser@example.com",
            "password": "password123",
        })

        assert resp.status_code == 200
        data = resp.get_json()
        assert "access_token" in data
        assert data["user"]["email"] == "testuser@example.com"

    def test_login_missing_fields(self, client):
        """POST /auth/login without email or password returns 400."""
        resp = client.post("/auth/login", json={"email": "only@example.com"})

        assert resp.status_code == 400
        assert "required" in resp.get_json()["error"].lower()

    def test_login_bad_credentials(self, client, sample_user):
        """POST /auth/login with wrong password returns 401."""
        resp = client.post("/auth/login", json={
            "email": "testuser@example.com",
            "password": "wrongpassword",
        })

        assert resp.status_code == 401


# ═══════════════════════════════════════════════════════════════════════
#  POST /auth/verify-email
# ═══════════════════════════════════════════════════════════════════════

class TestVerifyEmailEndpoint:
    def test_verify_email_success(self, client, app, seed_roles):
        """POST /auth/verify-email with a valid token returns 200."""
        # Register first to get a token
        reg_resp = client.post("/auth/register", json={
            "name": "Verify Me",
            "email": "verifyme@example.com",
            "password": "password123",
            "role": "User",
        })
        token = reg_resp.get_json()["verification_token"]

        resp = client.post("/auth/verify-email", json={"token": token})

        assert resp.status_code == 200
        assert "verified" in resp.get_json()["message"].lower()

    def test_verify_email_missing_token(self, client):
        """POST /auth/verify-email without a token returns 400."""
        resp = client.post("/auth/verify-email", json={})

        assert resp.status_code == 400
        assert "required" in resp.get_json()["error"].lower()


# ═══════════════════════════════════════════════════════════════════════
#  GET /auth/users  (Admin-protected)
# ═══════════════════════════════════════════════════════════════════════

class TestListUsersEndpoint:
    def test_list_users_as_admin(self, client, admin_token, admin_user):
        """GET /auth/users with admin JWT returns 200 and user list."""
        resp = client.get(
            "/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"},
        )

        assert resp.status_code == 200
        data = resp.get_json()
        assert "users" in data
        assert data["total"] >= 1

    def test_list_users_as_non_admin(self, client, user_token, sample_user):
        """GET /auth/users with non-admin JWT returns 403."""
        resp = client.get(
            "/auth/users",
            headers={"Authorization": f"Bearer {user_token}"},
        )

        assert resp.status_code == 403

    def test_list_users_no_auth(self, client):
        """GET /auth/users without any JWT returns 401."""
        resp = client.get("/auth/users")

        assert resp.status_code == 401
