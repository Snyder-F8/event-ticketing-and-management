from datetime import datetime, timedelta
from app import create_app, db
from app.models.user import Role, User
from app.models.category import Category
from app.models.event import Event, TicketType
from werkzeug.security import generate_password_hash

app = create_app()

def seed_data():
    with app.app_context():
        # 1. Roles - Only the ones you actually need
        roles = ["Admin", "Organizer", "Attendee"]   # Changed: removed "User"
        for r in roles:
            if not Role.query.filter_by(name=r).first():
                db.session.add(Role(name=r))
        db.session.commit()
        print(" Roles seeded: Admin, Organizer, Attendee")

        # 2. Seed Users (with realistic emails and strong defaults)
        users_data = [
            {
                "name": "Admin User",
                "email": "admin@ticketvibez.com",
                "password": "admin123",           # Change this in production!
                "role_name": "Admin"
            },
            {
                "name": "Organizer User",
                "email": "organizer@ticketvibez.com",
                "password": "organizer123",
                "role_name": "Organizer"
            },
            {
                "name": "Attendee User",
                "email": "attendee@ticketvibez.com",
                "password": "attendee123",
                "role_name": "Attendee"
            },
        ]

        for u in users_data:
            if not User.query.filter_by(email=u["email"]).first():
                role = Role.query.filter_by(name=u["role_name"]).first()
                if role:
                    user = User(
                        name=u["name"],
                        email=u["email"],
                        password=generate_password_hash(u["password"]),
                        role_id=role.id,
                        is_verified=True
                    )
                    db.session.add(user)
                    print(f"Created user: {u['email']} ({u['role_name']})")
                else:
                    print(f"Role {u['role_name']} not found for user {u['email']}")
        
        db.session.commit()
        print("Users seeded.")

        # 3. Categories (unchanged - looks good)
        categories = ["Music", "Tech", "Business", "Sports", "Art", "Food"]
        for c in categories:
            if not Category.query.filter_by(name=c).first():
                db.session.add(Category(name=c))
        db.session.commit()
        print("Categories seeded.")

        # 4. Events (unchanged - good)
        organizer = User.query.filter_by(email="organizer@ticketvibez.com").first()
        if not organizer:
            print("Organizer user not found. Skipping event seeding.")
            return

        # ... (your existing events_data list remains the same)

        for ed in events_data:
            if not Event.query.filter_by(title=ed["title"]).first():
                event = Event(
                    title=ed["title"],
                    description=ed["description"],
                    location=ed["location"],
                    event_date=ed["event_date"],
                    status=ed["status"],
                    organizer_id=organizer.id
                )
                db.session.add(event)
                db.session.flush()

                for td in ed["tickets"]:
                    db.session.add(TicketType(
                        event_id=event.id,
                        name=td["name"],
                        price=td["price"],
                        quantity=td["quantity"]
                    ))
        
        db.session.commit()
        print(" Sample events and tickets seeded.")
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_data()