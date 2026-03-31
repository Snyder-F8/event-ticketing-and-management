from app import create_app
from app.extensions import db
from app.models import Role, User

app = create_app()

def seed_data():
    with app.app_context():

        # Optional: clear existing data (careful in production!)
        db.session.query(User).delete()
        db.session.query(Role).delete()

        # Roles
        admin_role = Role(name="Admin")
        organizer_role = Role(name="Organizer")
        customer_role = Role(name="Customer")

        db.session.add_all([admin_role, organizer_role, customer_role])
        db.session.commit()

        # Users
        user1 = User(
            name="Admin User",
            email="admin@example.com",
            role_id=admin_role.id
        )

        user2 = User(
            name="Organizer User",
            email="organizer@example.com",
            role_id=organizer_role.id
        )

        db.session.add_all([user1, user2])
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()