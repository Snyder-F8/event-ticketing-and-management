from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app(config_class=None):
    app = Flask(__name__)
    
    if config_class is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Initialize CORS with specific allowed origins (important for Netlify + local dev)
    cors.init_app(
        app,
        origins=[
            "https://ticketvibez.netlify.app",      # ← Your production frontend
            "http://localhost:5173",                # Vite default dev server
            "http://127.0.0.1:5173",                # Alternative localhost
            # Add more if needed (e.g. your custom domain later)
        ],
        supports_credentials=True,                  # Important if using JWT cookies or auth headers
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"]
    )

    # Import models so Alembic detects them
    with app.app_context():
        from .models import (
            User, Role,
            Event, TicketType, Image, event_categories,
            Ticket, Payment,
            Category
        )

    # Register Blueprints
    from .routes.auth_routes import auth_bp
    from .blueprints.events.routes import events_bp
    from .blueprints.tickets.routes import tickets_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(tickets_bp)

    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app