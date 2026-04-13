# app/__init__.py

from flask import Flask
from flask_cors import CORS

from app.extensions import db, migrate, jwt
from app.routes.auth_routes import auth_bp
# from app.routes.events_routes import events_bp


def create_app():
    app = Flask(__name__)

    # =========================
    # CONFIG
    # =========================
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["JWT_SECRET_KEY"] = "super-secret-key"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # =========================
    # CORS (✅ YOUR FIX)
    # =========================
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": "http://localhost:5173"}}
    )

    # =========================
    # INIT EXTENSIONS
    # =========================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =========================
    # REGISTER BLUEPRINTS
    # =========================
    app.register_blueprint(auth_bp)
    # app.register_blueprint(events_bp)

    return app