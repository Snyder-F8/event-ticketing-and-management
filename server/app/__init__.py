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

    from .blueprints.events.routes import events_bp
    app.register_blueprint(events_bp)

    from .blueprints.tickets.routes import tickets_bp
    app.register_blueprint(tickets_bp)

    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app