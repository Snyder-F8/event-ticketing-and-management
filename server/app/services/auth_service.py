import secrets
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User, Role
from app.utils.email import (
    send_verification_email,
    send_login_notification_email,
    send_reset_password_email
)


# ====================== REGISTER ======================
def register_user(name: str, email: str, password: str, role_name: str = "Attendee"):
    # Duplicate check
    print("Test logger register")
    if User.query.filter_by(email=email).first():
        return {"error": "A user with this email already exists."}, 409

    # Normalize and validate role
    if role_name:
        role_name = role_name.strip().title()
    else:
        role_name = "Attendee"

    # Only allow these roles during self-registration
    allowed_registration_roles = {"Attendee", "Organizer"}
    if role_name not in allowed_registration_roles and role_name != "Admin":
        role_name = "Attendee"   # safe fallback

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

    # Send verification email
    print("Calling send verification email")
    send_verification_email(user, verification_token)
    print("End of send verification email")

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


# ====================== LOGIN ======================
def login_user(email: str, password: str):
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return {"error": "Invalid email or password."}, 401

    if not user.is_verified:
        return {"error": "Please verify your email before logging in."}, 403

    # Generate JWT token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role.name if user.role else None,
            "email": user.email,
        },
        expires_delta=timedelta(hours=24),
    )

    # Send login notification
    send_login_notification_email(user)

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.name if user.role else None,
        },
    }, 200


# ====================== VERIFY EMAIL ======================
def verify_email(token: str):
    user = User.query.filter_by(verification_token=token).first()

    if not user:
        return {"error": "Invalid or expired verification token."}, 400

    user.is_verified = True
    user.verification_token = None
    db.session.commit()

    return {"message": "Email verified successfully. You can now log in."}, 200


# ====================== RESEND VERIFICATION ======================
def resend_verification(email: str):
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "User with this email does not exist."}, 404
    if user.is_verified:
        return {"error": "Email is already verified."}, 400

    new_token = secrets.token_urlsafe(32)
    user.verification_token = new_token
    db.session.commit()

    send_verification_email(user, new_token)

    return {"message": "A new verification link has been sent to your email."}, 200


# ====================== GET ALL USERS ======================
def get_all_users():
    users = User.query.all()

    users_list = []
    for user in users:
        users_list.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.name if user.role else None,
            "is_verified": user.is_verified,
            "created_at": str(user.created_at) if hasattr(user, 'created_at') and user.created_at else None,
        })

    return {"users": users_list, "total": len(users_list)}, 200


# ====================== REQUEST PASSWORD RESET ======================
def request_password_reset(email: str):
    user = User.query.filter_by(email=email).first()
    if not user:
        # Don't reveal if email exists (security)
        return {"message": "If an account with that email exists, a reset link has been sent."}, 200

    reset_token = secrets.token_urlsafe(32)
    user.reset_password_token = reset_token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    send_reset_password_email(user, reset_token)

    return {"message": "A reset link has been sent to your email."}, 200


# ====================== RESET PASSWORD ======================
def reset_password(token: str, new_password: str):
    user = User.query.filter_by(reset_password_token=token).first()

    if not user:
        return {"error": "Invalid or expired reset token."}, 400

    if user.reset_password_expires and user.reset_password_expires < datetime.utcnow():
        return {"error": "Reset token has expired."}, 400

    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password
    user.reset_password_token = None
    user.reset_password_expires = None
    db.session.commit()

    return {"message": "Password has been reset successfully. You can now log in."}, 200