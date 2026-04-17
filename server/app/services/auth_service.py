import secrets
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User, Role
from app.utils.email import send_verification_email, send_login_notification_email, send_reset_password_email
from datetime import datetime, timedelta


# REGISTER
def register_user(name: str, email: str, password: str, role_name: str = "Attendee"):
    # Duplicate check
    if User.query.filter_by(email=email).first():
        return {"error": "A user with this email already exists."}, 409

    # Normalize and validate role
    if role_name:
        role_name = role_name.strip().title()
    else:
        role_name = "Attendee"   # safe default for normal users

    # Only allow these roles during self-registration (Admin usually created separately)
    allowed_registration_roles = {"Attendee", "Organizer"}
    if role_name not in allowed_registration_roles and role_name != "Admin":
        role_name = "Attendee"   # fallback instead of hard error

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return {"error": f"Role '{role_name}' does not exist. Please contact support."}, 400

    hashed_password = generate_password_hash(password)

    verification_token = secrets.token_urlsafe(32)

    user = User(
        name=name,
        email=email,
        password=hashed_password,
        role_id=role.id,
        is_verified=False,
        verification_token=verification_token,
    )
    db.session.add(user)
    db.session.commit()

    send_verification_email(user, verification_token)

    return {
        "message": "Registration successful. Please verify your email.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": role.name,
            "is_verified": user.is_verified,
        }
    }, 201
