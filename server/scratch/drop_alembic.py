from app import create_app
from app.extensions import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        db.session.execute(text("DROP TABLE IF EXISTS alembic_version"))
        db.session.commit()
        print("Successfully dropped alembic_version table.")
    except Exception as e:
        print(f"Error dropping table: {e}")
