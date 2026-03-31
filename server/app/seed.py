from app import create_app, db
from app.models import Role, User, Category
from werkzeug.security import generate_password_hash

app = create_app()

def seed_data():
    with app.app_context():
        roles = ["Admin", "Organizer", "User"]
        for r in roles:
            if not Role.query.filter_by(name=r).first():
                db.session.add(Role(name=r))
        db.session.commit()
        print("Roles seeded.")

        users_data = [
            {"name": "Admin User", "email": "admin@example.com", "password": "admin123", "role_name": "Admin"},
            {"name": "Organizer User", "email": "organizer@example.com", "password": "organizer123", "role_name": "Organizer"},
            {"name": "Regular User", "email": "user@example.com", "password": "user123", "role_name": "User"},
        ]

        for u in users_data:
            if not User.query.filter_by(email=u["email"]).first():
                role = Role.query.filter_by(name=u["role_name"]).first()
                user = User(
                    name=u["name"],
                    email=u["email"],
                    password=generate_password_hash(u["password"]),
                    role_id=role.id,
                    is_verified=True
                )
                db.session.add(user)
        db.session.commit()
        print("Users seeded.")

        categories = ["Music", "Tech", "Business", "Sports"]
        for c in categories:
            if not Category.query.filter_by(name=c).first():
                db.session.add(Category(name=c))
        db.session.commit()
        print("Categories seeded.")
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_data()