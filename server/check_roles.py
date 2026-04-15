from app import create_app
from app.models.user import Role

app = create_app()
with app.app_context():
    roles = Role.query.all()
    for r in roles:
        print(f"ID: {r.id}, Name: '{r.name}'")
