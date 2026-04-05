from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)                       
    cors.init_app(app)                      
    
    # Import models so Alembic detects them
    with app.app_context():
        from .models import (
            User, Role,
            Event, TicketType, Image, event_categories,
            Ticket, Payment,
            Category
        )

    
    # Register Blueprints (route groups)
    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app