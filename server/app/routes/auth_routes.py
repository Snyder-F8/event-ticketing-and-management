from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    get_all_users
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# =========================
# REGISTER
# =========================
@auth_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not all([name, email, password]):
        return jsonify({"error": "name, email, password required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    response, status_code = register_user(name, email, password, role)

    return jsonify(response), status_code


# =========================
# LOGIN (FIXED)
# =========================
@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    result, status_code = login_user(email, password)

    if status_code != 200:
        return jsonify(result), status_code

    # ✅ IMPORTANT: return EXACT backend structure
    return jsonify({
        "access_token": result.get("access_token"),
        "user": result.get("user"),
        "message": result.get("message")
    }), 200


# =========================
# VERIFY EMAIL
# =========================
@auth_bp.route("/verify-email", methods=["POST", "OPTIONS"])
def verify_email_route():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()

    if not data or not data.get("token"):
        return jsonify({"error": "Verification token is required"}), 422

    response, status_code = verify_email(data["token"])

    return jsonify(response), status_code


# =========================
# GET CURRENT USER
# =========================
@auth_bp.route("/me", methods=["GET", "OPTIONS"])
@jwt_required()
def get_current_user():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    claims = get_jwt()

    return jsonify({
        "user": {
            "id": claims.get("sub"),
            "role": str(claims.get("role", "user")).lower()
        }
    }), 200


# =========================
# GET USERS (ADMIN ONLY)
# =========================
@auth_bp.route("/users", methods=["GET", "OPTIONS"])
@jwt_required()
def list_users():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    claims = get_jwt()

    if str(claims.get("role", "")).lower() != "admin":
        return jsonify({"error": "Admin access required"}), 403

    response, status_code = get_all_users()

    return jsonify(response), status_code