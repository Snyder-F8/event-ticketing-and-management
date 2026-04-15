from datetime import datetime, timedelta
from app import create_app, db
from app.models.user import Role, User
from app.models.category import Category
from app.models.event import Event, TicketType
from werkzeug.security import generate_password_hash

app = create_app()

def seed_data():
    with app.app_context():
        # 1. Roles
        roles = ["Admin", "Organizer", "User"]
        for r in roles:
            if not Role.query.filter_by(name=r).first():
                db.session.add(Role(name=r))
        db.session.commit()
        print("Roles seeded.")

        # 2. Users
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

        # 3. Categories
        categories = ["Music", "Tech", "Business", "Sports", "Art", "Food"]
        for c in categories:
            if not Category.query.filter_by(name=c).first():
                db.session.add(Category(name=c))
        db.session.commit()
        print("Categories seeded.")

        # 4. Events
        organizer = User.query.filter_by(email="organizer@example.com").first()
        if not organizer:
            print("Error: Organizer user not found for seeding events.")
            return

        events_data = [
            {
                "title": "Grand Music Concert 2026",
                "description": "An evening of live orchestral and modern music.",
                "location": "Garden Square, Nairobi",
                "event_date": datetime.now() + timedelta(days=45),
                "status": "pending",
                "tickets": [
                    {"name": "Regular", "price": 1000, "quantity": 500},
                    {"name": "VIP", "price": 3500, "quantity": 100}
                ]
            },
            {
                "title": "Tech Innovation Summit",
                "description": "Exploring the future of AI and Web3.",
                "location": "Sarit Expo Centre",
                "event_date": datetime.now() + timedelta(days=60),
                "status": "approved",
                "tickets": [
                    {"name": "Early Bird", "price": 2000, "quantity": 200},
                    {"name": "Standard", "price": 5000, "quantity": 300}
                ]
            },
            {
                "title": "Community Charity Run",
                "description": "5km run to support local schools.",
                "location": "Karura Forest",
                "event_date": datetime.now() + timedelta(days=20),
                "status": "pending",
                "tickets": [
                    {"name": "Registration", "price": 500, "quantity": 1000}
                ]
            },
            {
                "title": "International Art Fair",
                "description": "Showcasing local and international artists.",
                "location": "Village Market",
                "event_date": datetime.now() + timedelta(days=15),
                "status": "approved",
                "tickets": [
                    {"name": "Day Pass", "price": 800, "quantity": 400}
                ]
            }
        ]

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
                db.session.flush() # Get ID for tickets

                for td in ed["tickets"]:
                    db.session.add(TicketType(
                        event_id=event.id,
                        name=td["name"],
                        price=td["price"],
                        quantity=td["quantity"]
                    ))
        
        db.session.commit()
        print("Sample events and tickets seeded.")
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_data()