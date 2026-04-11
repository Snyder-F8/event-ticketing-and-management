from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app(config_class=None):
    app = Flask(__name__)

    # =========================
    # CONFIG
    # =========================
    if config_class is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(config_class)

    # =========================
    # EXTENSIONS
    # =========================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =========================
    # CORS (FIXED - NO MORE ERRORS)
    # =========================
    cors.init_app(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=False
    )

    # FORCE OPTIONS HANDLING (CRITICAL FIX FOR PRE-FLIGHT)
    @app.after_request
    def after_request(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # =========================
    # IMPORT MODELS (FOR MIGRATIONS)
    # =========================
    with app.app_context():
        from .models import (
            User, Role,
            Event, TicketType, Image, event_categories,
            Ticket, Payment,
            Category
        )

    # =========================
    # BLUEPRINTS
    # =========================
    from .routes.auth_routes import auth_bp
    from .blueprints.events.routes import events_bp
    from .blueprints.tickets.routes import tickets_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(tickets_bp)

    # =========================
    # HEALTH CHECK
    # =========================
    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app