import resend
from flask import current_app, request
from datetime import datetime

def send_email(to_email, subject, html_content):
    # Always print email content locally for easy testing
    print("\n" + "="*60)
    print(f"EMAIL SENT TO: {to_email}")
    print(f"SUBJECT: {subject}")
    print("-" * 60)
    print(f"CONTENT:\n{html_content}")
    print("="*60 + "\n")

    try:
        # Check if API key exists and is not placeholder
        api_key = current_app.config.get("RESEND_API_KEY")
        if not api_key or api_key == "re_your_api_key_here":
            print("Skipping Resend: No valid RESEND_API_KEY provided.")
            current_app.logger.warning("Resend email skipped - No API key configured")
            return {"success": False, "error": "No valid RESEND_API_KEY"}

        resend.api_key = api_key

        # Use safe default From address if not configured
        from_email = current_app.config.get("RESEND_FROM_EMAIL", "TicketVibez <onboarding@resend.dev>")

        params = {
            "from": from_email,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        
        r = resend.Emails.send(params)
        print(f"RESEND SUCCESS: Email sent! ID: {r.get('id')}")
        current_app.logger.info(f"Resend email sent successfully to {to_email} | ID: {r.get('id')}")
        
        return {"success": True, "id": r.get("id")}

    except Exception as e:
        error_msg = str(e)
        print(f"RESEND API ERROR: {error_msg}")
        current_app.logger.error(f"Resend failed for {to_email}: {error_msg}")
        return {"success": False, "error": error_msg}


def send_verification_email(user, token):
    # === CRITICAL CHANGE: Use Netlify frontend URL ===
    frontend_url = current_app.config.get("FRONTEND_URL")
    
    if not frontend_url:
        # Fallback for local development
        frontend_url = "http://localhost:5173"
    
    frontend_url = frontend_url.rstrip("/")
    
    verify_url = f"{frontend_url}/verify?token={token}"

    subject = "Verify Your Email - TicketVibez"

    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">Welcome to TicketVibez! 🎫</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Thanks for signing up! Please verify your email address to get started.</p>
        
        <div style="margin:32px 0;">
            <a href="{verify_url}" 
               style="background-color:#4F46E5;color:white;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:16px;">
                Verify Email Address
            </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;color:#6b7280;font-size:14px;background:#f8fafc;padding:12px;border-radius:4px;">
            {verify_url}
        </p>
        
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            This link will expire soon. If you didn't create an account, you can safely ignore this email.
        </p>
    </div>
    """

    result = send_email(user.email, subject, html_content)

    if not result.get("success"):
        current_app.logger.warning(f"Verification email FAILED for {user.email}: {result.get('error')}")

    return result


# Keep your other email functions (only small improvements for consistency)
def send_login_notification_email(user):
    subject = "New Login Detected - TicketVibez"
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
        <p>If this was you, ignore this email. If not, please reset your password immediately.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Automated security notification.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


def send_ticket_confirmation_email(user, ticket, event):
    subject = f"🎟️ Your Ticket for {event.title} — Confirmed!"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#4F46E5;">Ticket Confirmed! 🎉</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Your ticket purchase was successful. Here are your details:</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;margin:16px 0;">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {event.event_date.strftime("%B %d, %Y at %I:%M %p") if getattr(event, 'event_date', None) else "TBA"}</p>
            <p><strong>Location:</strong> {getattr(event, 'location', "TBA")}</p>
            <p><strong>Ticket Code:</strong> <code style="background:#e0e7ff;padding:4px 10px;border-radius:4px;">{ticket.ticket_code}</code></p>
            <p><strong>Ticket Type:</strong> {getattr(ticket.ticket_type, 'name', 'N/A')}</p>
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
    body = "Your event has been approved and is now live on the platform." if approved else "Your event did not meet our guidelines. Please review and resubmit."
    
    subject = f"Event {status}: {event.title}"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:{color};">Event {status}</h2>
        <p>Hi <strong>{organizer.name}</strong>,</p>
        <p>{body}</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;margin:16px 0;">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {event.event_date.strftime("%B %d, %Y at %I:%M %p") if getattr(event, 'event_date', None) else "TBA"}</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Automated message. Do not reply.</p>
    </div>
    """
    return send_email(organizer.email, subject, html_content)


def send_organizer_rejection_email(user):
    subject = "Organizer Application Update - TicketVibez"
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#dc2626;">Application Update</h2>
        <p>Hi <strong>{user.name}</strong>,</p>
        <p>Thank you for your interest in becoming an organizer on TicketVibez.</p>
        <p>After reviewing your application, we regret to inform you that we cannot approve your organizer account at this time.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Thank you for your understanding.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)


def send_reset_password_email(user, token):
    frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")
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
        <p>If the button doesn't work, copy this link:</p>
        <p style="word-break:break-all;color:#6b7280;font-size:14px;">{reset_url}</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">This link will expire in 1 hour. If you didn't request this, ignore the email.</p>
    </div>
    """
    return send_email(user.email, subject, html_content)