# Routes package
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # ✅ IMPORTANT FIX
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": "http://localhost:5173"}}
    )

    return app