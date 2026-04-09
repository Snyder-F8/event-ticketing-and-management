from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.ticket import Ticket, Payment
from app.models.event import Event, TicketType
from app.utils.mpesa import initiate_stk_push
from app.utils.email import send_ticket_confirmation_email

tickets_bp = Blueprint("tickets", __name__, url_prefix="/api/tickets")


@tickets_bp.route("", methods=["POST"])
@jwt_required()
def purchase_ticket():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    errors = validate_ticket_data(data)
    if errors:
        return jsonify({"errors": errors}), 422

    ticket_type = TicketType.query.get_or_404(data["ticket_type_id"])
    event = Event.query.get_or_404(ticket_type.event_id)
    quantity = data.get("quantity", 1)
    phone_number = data["phone_number"]

    if event.status != "approved":
        return jsonify({"error": "Event not available for purchase."}), 400

    if ticket_type.tickets_remaining < quantity:
        return jsonify({
            "error": f"Only {ticket_type.tickets_remaining} tickets remaining."
        }), 400

    total_amount = float(ticket_type.price) * quantity

    try:
        ticket = Ticket(
            event_id=event.id,
            user_id=current_user_id,
            ticket_type_id=ticket_type.id,
            quantity=quantity,
            total_amount=total_amount,
            status="pending",
        )
        db.session.add(ticket)
        db.session.flush()

        payment = Payment(
            ticket_id=ticket.id,
            amount=total_amount,
            phone_number=phone_number,
            status="pending",
        )
        db.session.add(payment)
        db.session.flush()

        stk_response = initiate_stk_push(
            phone_number=phone_number,
            amount=total_amount,
            account_reference=f"EVENT-{event.id}",
            transaction_desc=f"Ticket for {event.title}",
        )

        if not stk_response.get("success"):
            db.session.rollback()
            return jsonify({
                "error": "Failed to initiate M-Pesa payment.",
                "details": stk_response.get("message"),
            }), 502

        payment.mpesa_checkout_request_id = stk_response.get("CheckoutRequestID")
        payment.mpesa_merchant_request_id = stk_response.get("MerchantRequestID")

        db.session.commit()

        return jsonify({
            "message": "Payment initiated. Complete the M-Pesa prompt on your phone.",
            "checkout_request_id": stk_response.get("CheckoutRequestID"),
            "ticket_id": ticket.id,
            "total_amount": total_amount,
        }), 202

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Purchase failed.", "details": str(e)}), 500


@tickets_bp.route("/mpesa-callback", methods=["POST"])
def mpesa_callback():
    data = request.get_json()
    try:
        body = data["Body"]["stkCallback"]
        checkout_request_id = body["CheckoutRequestID"]
        result_code = body["ResultCode"]

        payment = Payment.query.filter_by(
            mpesa_checkout_request_id=checkout_request_id
        ).first()

        if not payment:
            return jsonify({"message": "Payment not found."}), 404

        if result_code == 0:
            items = body.get("CallbackMetadata", {}).get("Item", [])
            receipt = next(
                (i["Value"] for i in items if i["Name"] == "MpesaReceiptNumber"),
                None
            )
            payment.status = "success"
            payment.mpesa_code = receipt

            ticket = payment.ticket
            if ticket:
                ticket.status = "confirmed"
                ticket_type = TicketType.query.get(ticket.ticket_type_id)
                if ticket_type:
                    ticket_type.tickets_sold = (
                        ticket_type.tickets_sold or 0
                    ) + ticket.quantity
                if ticket.user and ticket.event:
                    send_ticket_confirmation_email(
                        user=ticket.user,
                        ticket=ticket,
                        event=ticket.event,
                    )
        else:
            payment.status = "failed"
            ticket = payment.ticket
            if ticket:
                ticket.status = "cancelled"

        db.session.commit()
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Callback failed.", "details": str(e)}), 500


@tickets_bp.route("/my-tickets", methods=["GET"])
@jwt_required()
def my_tickets():
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    paginated = (
        Ticket.query
        .filter_by(user_id=current_user_id)
        .order_by(Ticket.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        "tickets": [t.to_dict() for t in paginated.items],
        "pagination": {
            "page": paginated.page,
            "per_page": paginated.per_page,
            "total_pages": paginated.pages,
            "total_items": paginated.total,
            "has_next": paginated.has_next,
            "has_prev": paginated.has_prev,
        }
    }), 200


@tickets_bp.route("/<string:ticket_code>", methods=["GET"])
@jwt_required()
def get_ticket(ticket_code):
    current_user_id = get_jwt_identity()
    ticket = Ticket.query.filter_by(ticket_code=ticket_code).first_or_404()

    if ticket.user_id != current_user_id:
        return jsonify({"error": "Access denied."}), 403

    return jsonify({"ticket": ticket.to_dict()}), 200


def validate_ticket_data(data):
    errors = {}
    if not data.get("ticket_type_id"):
        errors["ticket_type_id"] = "Ticket type is required."
    if not data.get("phone_number"):
        errors["phone_number"] = "Phone number is required."
    else:
        phone = str(data["phone_number"]).strip()
        if not phone.startswith("2547") or len(phone) != 12:
            errors["phone_number"] = "Use format: 2547XXXXXXXX"
    quantity = data.get("quantity", 1)
    if not isinstance(quantity, int) or quantity < 1:
        errors["quantity"] = "Quantity must be a positive integer."
    return errors