from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
import os
from app.extensions import db
from app.models.event import Event, TicketType, Image
from app.models.category import Category
from app.utils.email import send_event_approval_email
from datetime import datetime

events_bp = Blueprint("events", __name__, url_prefix="/api/events")


def get_current_role():
    claims = get_jwt()
    return claims.get("role", "").lower()


@events_bp.route("", methods=["GET"])
def get_events():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    location = request.args.get("location", "").strip()
    category = request.args.get("category", "").strip()
    search = request.args.get("search", "").strip()

    query = Event.query.filter_by(status="approved")

    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    if category:
        query = query.join(Event.categories).filter(
            Category.name.ilike(f"%{category}%")
        )
    if search:
        query = query.filter(db.or_(
            Event.title.ilike(f"%{search}%"),
            Event.description.ilike(f"%{search}%"),
        ))

    query = query.order_by(Event.event_date.asc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "events": [e.to_dict() for e in paginated.items],
        "pagination": {
            "page": paginated.page,
            "per_page": paginated.per_page,
            "total_pages": paginated.pages,
            "total_items": paginated.total,
            "has_next": paginated.has_next,
            "has_prev": paginated.has_prev,
        }
    }), 200


@events_bp.route("/my-events", methods=["GET"])
@jwt_required()
def my_events():
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    paginated = (
        Event.query
        .filter_by(organizer_id=current_user_id)
        .order_by(Event.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        "events": [e.to_dict() for e in paginated.items],
        "pagination": {
            "page": paginated.page,
            "per_page": paginated.per_page,
            "total_pages": paginated.pages,
            "total_items": paginated.total,
            "has_next": paginated.has_next,
            "has_prev": paginated.has_prev,
        }
    }), 200


@events_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify({"event": event.to_dict()}), 200


@events_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    if get_current_role() not in ("organizer", "admin"):
        return jsonify({"error": "Access denied"}), 403

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filename = f"{int(datetime.now().timestamp())}_{filename}"
        
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        file.save(os.path.join(upload_folder, filename))
        
        # Build absolute URL using base request info
        base_url = request.host_url.rstrip('/')
        return jsonify({"url": f"{base_url}/static/uploads/{filename}"}), 200

@events_bp.route("", methods=["POST"])
@jwt_required()
def create_event():
    role = get_current_role()
    if role not in ("organizer", "admin"):
        return jsonify({"error": "Access denied. Organizers only."}), 403

    data = request.get_json()
    errors = validate_event_data(data)
    if errors:
        return jsonify({"errors": errors}), 422

    try:
        event = Event(
            title=data["title"],
            description=data.get("description"),
            location=data.get("location"),
            event_date=datetime.fromisoformat(data["event_date"]),
            organizer_id=get_jwt_identity(),
            status="pending",
        )
        db.session.add(event)
        db.session.flush()

        if "image_url" in data and data["image_url"].strip():
            image = Image(event_id=event.id, image_url=data["image_url"].strip())
            db.session.add(image)

        for cat_name in data.get("categories", []):
            category = Category.query.filter_by(name=cat_name).first()
            if category:
                event.categories.append(category)

        for tt in data.get("ticket_types", []):
            ticket_type = TicketType(
                event_id=event.id,
                name=tt["name"],
                price=tt["price"],
                quantity=tt["quantity"],
            )
            db.session.add(ticket_type)

        db.session.commit()
        return jsonify({
            "message": "Event created. Pending admin approval.",
            "event": event.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create event.", "details": str(e)}), 500


@events_bp.route("/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    current_user_id = get_jwt_identity()
    role = get_current_role()
    event = Event.query.get_or_404(event_id)

    if role != "admin" and event.organizer_id != current_user_id:
        return jsonify({"error": "Permission denied."}), 403

    data = request.get_json()

    for field in ["title", "description", "location"]:
        if field in data:
            setattr(event, field, data[field])

    if "event_date" in data:
        try:
            event.event_date = datetime.fromisoformat(data["event_date"])
        except ValueError:
            return jsonify({"error": "Invalid date. Use YYYY-MM-DDTHH:MM:SS"}), 422

    if "categories" in data:
        event.categories = []
        for cat_name in data["categories"]:
            category = Category.query.filter_by(name=cat_name).first()
            if category:
                event.categories.append(category)

    if role == "admin" and "status" in data:
        if data["status"] not in ("approved", "rejected", "pending"):
            return jsonify({"error": "Invalid status."}), 422
        event.status = data["status"]

    try:
        db.session.commit()
        return jsonify({
            "message": "Event updated successfully.",
            "event": event.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update event.", "details": str(e)}), 500


@events_bp.route("/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    role = get_current_role()
    event = Event.query.get_or_404(event_id)

    if role != "admin" and event.organizer_id != current_user_id:
        return jsonify({"error": "Permission denied."}), 403

    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete event.", "details": str(e)}), 500


@events_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_events_admin():
    if get_current_role() != "admin":
        return jsonify({"error": "Admin access required."}), 403

    status = request.args.get("status")
    query = Event.query

    if status:
        query = query.filter_by(status=status)

    events = query.order_by(Event.created_at.desc()).all()
    return jsonify({"events": [e.to_dict() for e in events]}), 200


@events_bp.route("/<int:event_id>/approve", methods=["PATCH"])
@jwt_required()
def approve_event(event_id):
    if get_current_role() != "admin":
        return jsonify({"error": "Admin access required."}), 403

    event = Event.query.get_or_404(event_id)
    action = request.get_json().get("action")

    if action == "approve":
        event.status = "approved"
        message = "Event approved successfully."
    elif action == "reject":
        event.status = "rejected"
        message = "Event rejected."
    else:
        return jsonify({"error": "Use 'approve' or 'reject'."}), 422

    try:
        db.session.commit()
        if event.organizer:
            send_event_approval_email(
                organizer=event.organizer,
                event=event,
                approved=(action == "approve")
            )
        return jsonify({"message": message, "event": event.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed.", "details": str(e)}), 500


def validate_event_data(data):
    errors = {}
    if not data.get("title", "").strip():
        errors["title"] = "Title is required."
    if not data.get("event_date"):
        errors["event_date"] = "Event date is required."
    else:
        try:
            datetime.fromisoformat(data["event_date"])
        except ValueError:
            errors["event_date"] = "Use format: YYYY-MM-DDTHH:MM:SS"

    for i, tt in enumerate(data.get("ticket_types", [])):
        if not tt.get("name") or not tt.get("name").strip():
            errors[f"ticket_type_{i}_name"] = "Ticket name is required."
        if not isinstance(tt.get("price"), (int, float)) or tt["price"] < 0:
            errors[f"ticket_type_{i}_price"] = "Price must be non-negative."
        if not isinstance(tt.get("quantity"), int) or tt["quantity"] < 1:
            errors[f"ticket_type_{i}_quantity"] = "Quantity must be a positive integer."
    return errors