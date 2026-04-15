import resend
from flask import current_app, request


def send_email(to_email, subject, html_content):
    # For local development/testing: always print the email content to the console
    # This allows testing verification even if the email provider (Resend) is restricted.
    print("\n" + "="*50)
    print(f"EMAIL SENT TO: {to_email}")
    print(f"SUBJECT: {subject}")
    print("-" * 50)
    print(f"CONTENT:\n{html_content}")
    print("="*50 + "\n")

    try:
        if not current_app.config["RESEND_API_KEY"] or current_app.config["RESEND_API_KEY"] == "re_your_api_key_here":
            print("Skipping Resend: No valid API key provided.")
            return {"success": False, "error": "No API key"}

        resend.api_key = current_app.config["RESEND_API_KEY"]
        
        params = {
            "from": current_app.config["RESEND_FROM_EMAIL"],
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        
        r = resend.Emails.send(params)
        print(f"RESEND SUCCESS: Email sent! ID: {r.get('id')}")
        return {"success": True, "id": r.get("id")}
    except Exception as e:
        print(f"RESEND API ERROR: {str(e)}")
        current_app.logger.error(f"Resend error: {str(e)}")
        return {"success": False, "error": str(e)}


def send_verification_email(user, token):
    # Determine base URL from request or config
    base_url = request.host_url.rstrip('/')
    # In a real app, this might point to the frontend URL
    # Assuming frontend runs on localhost:5173 for dev
    frontend_url = "http://localhost:5173"
    verify_url = f"{frontend_url}/verify?token={token}"

    subject = "Verify Your Email - TicketVibez"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">Welcome to TicketVibez! 🎫</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Thanks for signing up! Please verify your email address to get started.</p>
        <div style="margin:24px 0;">
            <a href="{verify_url}" style="background-color:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
                Verify Email Address
            </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;color:#6b7280;font-size:14px;">{verify_url}</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">This link will expire soon. If you didn't create an account, you can safely ignore this email.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


def send_login_notification_email(user):
    subject = "New Login Detected - TicketVibez"
    from datetime import datetime
    now = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">New Login Alert 🔔</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Your account was just logged into from a new session.</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;margin:16px 0;">
            <p><strong>Time:</strong> {now}</p>
            <p><strong>Account:</strong> {user.email}</p>
        </div>
        <p>If this was you, you can ignore this email. If you don't recognize this activity, please reset your password immediately.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Automated security notification.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


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
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Automated message. Do not reply.</p>
    </div>
    """
    return send_email(organizer.email, subject, html_content)


def send_organizer_rejection_email(user):
    subject = "Organizer Application Update - TicketVibez"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#dc2626;">Application Update</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Thank you for your interest in becoming an organizer on TicketVibez.</p>
        <p>After reviewing your application, we regret to inform you that we cannot approve your organizer account at this time.</p>
        <p>If you have any questions or would like to provide more information, please contact our support team.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Thank you for your understanding.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


def send_reset_password_email(user, token):
    frontend_url = "http://localhost:5173"
    reset_url = f"{frontend_url}/reset-password?token={token}"

    subject = "Reset Your Password - TicketVibez"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">Password Reset Request 🔑</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>We received a request to reset the password for your TicketVibez account.</p>
        <div style="margin:24px 0;">
            <a href="{reset_url}" style="background-color:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
                Reset Password
            </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;color:#6b7280;font-size:14px;">{reset_url}</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)