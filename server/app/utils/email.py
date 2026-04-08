import sendgrid
from sendgrid.helpers.mail import Mail
from flask import current_app


def send_email(to_email, subject, html_content):
    try:
        sg = sendgrid.SendGridAPIClient(
            api_key=current_app.config["SENDGRID_API_KEY"]
        )
        message = Mail(
            from_email=current_app.config["SENDGRID_FROM_EMAIL"],
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
        )
        response = sg.send(message)
        return {"success": True, "status_code": response.status_code}
    except Exception as e:
        current_app.logger.error(f"SendGrid error: {str(e)}")
        return {"success": False, "error": str(e)}


def send_ticket_confirmation_email(user, ticket, event):
    subject = f"🎟️ Your Ticket for {event.title} — Confirmed!"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">Ticket Confirmed! 🎉</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Your ticket purchase was successful. Here are your details:</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;margin:16px 0;">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {event.event_date.strftime("%B %d, %Y at %I:%M %p") if event.event_date else "TBA"}</p>
            <p><strong>Location:</strong> {event.location or "TBA"}</p>
            <p><strong>Ticket Code:</strong>
               <code style="background:#e0e7ff;padding:4px 10px;border-radius:4px;">
               {ticket.ticket_code}</code></p>
            <p><strong>Ticket Type:</strong> {ticket.ticket_type.name if ticket.ticket_type else "N/A"}</p>
            <p><strong>Quantity:</strong> {ticket.quantity}</p>
            <p><strong>Amount Paid:</strong> KES {ticket.total_amount:,.2f}</p>
        </div>
        <p>Present your ticket code at the entrance.</p>
        <p style="color:#9ca3af;font-size:12px;">Automated message. Do not reply.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


def send_event_approval_email(organizer, event, approved=True):
    status = "Approved ✅" if approved else "Rejected ❌"
    color = "#16a34a" if approved else "#dc2626"
    body = (
        "Your event has been approved and is now live on the platform."
        if approved else
        "Your event did not meet our guidelines. Please review and resubmit."
    )
    subject = f"Event {status}: {event.title}"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:{color};">Event {status}</h2>
        <p>Hi <strong>{organizer.name}</strong>,</p>
        <p>{body}</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;margin:16px 0;">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {event.event_date.strftime("%B %d, %Y at %I:%M %p") if event.event_date else "TBA"}</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;">Automated message. Do not reply.</p>
    </div>
    """
    return send_email(organizer.email, subject, html_content)