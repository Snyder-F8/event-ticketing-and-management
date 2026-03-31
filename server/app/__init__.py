from flask import Flask
from .config import Config
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import models so Alembic detects them
    with app.app_context():
        from .models import (
            User, Role,
            Event, TicketType, Image, event_categories,
            Ticket, Payment,
            Category
        )

    # Basic route
    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app