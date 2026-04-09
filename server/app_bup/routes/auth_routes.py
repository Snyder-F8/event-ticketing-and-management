from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.auth_service import register_user, login_user, verify_email, get_all_users

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# POST /auth/register
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "User")

    if not all([name, email, password]):
        return jsonify({"error": "name, email, and password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    response, status_code = register_user(name, email, password, role)
    return jsonify(response), status_code

# POST /auth/login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "email and password are required."}), 400

    response, status_code = login_user(email, password)
    return jsonify(response), status_code

# POST /auth/verify-email
@auth_bp.route("/verify-email", methods=["POST"])
def verify():
    data = request.get_json()

    if not data or not data.get("token"):
        return jsonify({"error": "Verification token is required."}), 400

    response, status_code = verify_email(data["token"])
    return jsonify(response), status_code

# GET /auth/users  (Admin only — requires JWT)
@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Admin access required."}), 403

    response, status_code = get_all_users()
    return jsonify(response), status_code

