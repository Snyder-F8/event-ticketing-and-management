import requests
import base64
from datetime import datetime
from flask import current_app
import logging



def get_mpesa_access_token():
    consumer_key = current_app.config["MPESA_CONSUMER_KEY"]
    consumer_secret = current_app.config["MPESA_CONSUMER_SECRET"]
    credentials = base64.b64encode(
        f"{consumer_key}:{consumer_secret}".encode()
    ).decode()
    try:
        response = requests.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate"
            "?grant_type=client_credentials",
            headers={"Authorization": f"Basic {credentials}"},
            timeout=30,
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        return None
    except Exception:
        return None


def generate_password(shortcode, passkey, timestamp):
    raw = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(raw.encode()).decode()


def initiate_stk_push(phone_number, amount, account_reference, transaction_desc):
    try:
        access_token = get_mpesa_access_token()
        if not access_token:
            return {"success": False, "message": "Failed to get M-Pesa access token."}

        shortcode = current_app.config["MPESA_SHORTCODE"]
        passkey = current_app.config["MPESA_PASSKEY"]
        callback_url = current_app.config["MPESA_CALLBACK_URL"]
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = generate_password(shortcode, passkey, timestamp)

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc,
        }

        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )

        response_data = response.json()
        current_app.logger.info(f"Response data: " + str(response_data))
        if response_data.get("ResponseCode") == "0":
            return {
                "success": True,
                "CheckoutRequestID": response_data.get("CheckoutRequestID"),
                "MerchantRequestID": response_data.get("MerchantRequestID"),
                "message": response_data.get("CustomerMessage"),
            }
        return {
            "success": False,
            "message": response_data.get("errorMessage", "STK push failed."),
        }

    except requests.exceptions.Timeout:
        return {"success": False, "message": "M-Pesa request timed out."}
    except Exception as e:
        return {"success": False, "message": str(e)}