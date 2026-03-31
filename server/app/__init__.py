from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register models so Alembic can detect them
    with app.app_context():
        from .models.user import Role, User
        from .models.event import Event, TicketType, Image, event_categories
        from .models.ticket import Ticket, Payment
        from .models.category import Category

    # You can register blueprints here later (e.g., auth, events, tickets)
    # from .routes.auth import auth_bp
    # app.register_blueprint(auth_bp)

    return app