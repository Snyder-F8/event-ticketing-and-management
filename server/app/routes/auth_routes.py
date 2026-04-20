from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import logging

from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    resend_verification,
    get_all_users,
    request_password_reset,
    reset_password
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ====================== REGISTER ======================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role')   # "Attendee" or "Organizer" from frontend

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    logger.info("This is properly logged and visible in most environments")
    print("I hope this shows up in the logs")
    result, status_code = register_user(
        name=name,
        email=email,
        password=password,
        role_name=role_name
    )
    return jsonify(result), status_code


# ====================== LOGIN ======================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    result, status_code = login_user(email=email, password=password)
    return jsonify(result), status_code


# ====================== VERIFY EMAIL ======================
@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email_route(token):
    result, status_code = verify_email(token)
    return jsonify(result), status_code


# ====================== RESEND VERIFICATION ======================
@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification_route():
    data = request.get_json(silent=True) or {}
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required."}), 400

    result, status_code = resend_verification(email)
    return jsonify(result), status_code


# ====================== GET ALL USERS (Admin only) ======================
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    jwt_data = get_jwt()
    if jwt_data.get("role") != "Admin":
        return jsonify({"error": "Admin access required."}), 403

    result, status_code = get_all_users()
    return jsonify(result), status_code


# ====================== REQUEST PASSWORD RESET ======================
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required."}), 400

    result, status_code = request_password_reset(email)
    return jsonify(result), status_code


# ====================== RESET PASSWORD ======================
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    data = request.get_json(silent=True) or {}

    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required."}), 400

    result, status_code = reset_password(token, new_password)
    return jsonify(result), status_code