from app import create_app
from app.models.user import User

app = create_app()
with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"User: {u.email}, Role: {u.role.name}, Verified: {u.is_verified}")
