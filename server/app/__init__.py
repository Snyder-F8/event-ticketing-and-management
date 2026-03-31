from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    # Import models so Alembic knows about them
    with app.app_context():
        from .models.user import Role, User
        from .models.event import Event, TicketType, Image, event_categories
        from .models.ticket import Ticket, Payment
        from .models.category import Category

    # Basic home route for testing
    @app.route("/")
    def home():
        return {"message": "Backend is running successfully!"}

    return app