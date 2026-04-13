from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt

organizer_bp = Blueprint("organizer", __name__, url_prefix="/organizer")


@organizer_bp.route("/metrics", methods=["GET"])
@jwt_required()
def get_metrics():
    claims = get_jwt()

    if claims.get("role") != "organizer":
        return jsonify({"error": "Access forbidden"}), 403

    return jsonify({
        "total_events": 5,
        "tickets_sold": 120,
        "revenue": 45000
    }), 200