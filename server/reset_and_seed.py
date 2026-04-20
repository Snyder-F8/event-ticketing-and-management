import sys
import os
from datetime import datetime, timedelta

# Fix: Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models.user import Role, User
from app.models.category import Category
from app.models.event import Event, TicketType, Image
from app.models.ticket import Ticket, Payment
from werkzeug.security import generate_password_hash

app = create_app()

def reset_and_seed():
    with app.app_context():
        print("Wiping existing data...")
        
        # Order matters for foreign keys
        Payment.query.delete()
        Ticket.query.delete()
        TicketType.query.delete()
        Image.query.delete()
        
        # Clear Event-Category association
        for event in Event.query.all():
            event.categories = []
        
        Event.query.delete()
        Category.query.delete()
        User.query.delete()
        Role.query.delete()
        
        db.session.commit()
        print("Database cleared.")

        # 1. Create Roles
        roles = ["Admin", "Organizer", "Attendee"]
        role_objs = {}
        for r_name in roles:
            role = Role(name=r_name)
            db.session.add(role)
            role_objs[r_name] = role
        db.session.commit()
        print("Roles recreated.")

        # 2. Create Test Users
        users_data = [
            {
                "name": "System Admin",
                "email": "admin@ticketvibez.com",
                "password": "admin123",
                "role": "Admin"
            },
            {
                "name": "Event Organizer",
                "email": "organizer@ticketvibez.com",
                "password": "organizer123",
                "role": "Organizer"
            },
            {
                "name": "Regular Attendee",
                "email": "attendee@ticketvibez.com",
                "password": "attendee123",
                "role": "Attendee"
            }
        ]

        for u in users_data:
            user = User(
                name=u["name"],
                email=u["email"],
                password=generate_password_hash(u["password"]),
                role_id=role_objs[u["role"]].id,
                is_verified=True
            )
            db.session.add(user)
        
        db.session.commit()
        print("Test users created successfully.")

        # 3. Create Basic Categories
        categories = ["Music", "Tech", "Business", "Sports", "Art", "Food"]
        for c in categories:
            db.session.add(Category(name=c))
        db.session.commit()
        print("Categories seeded.")

        print("\n" + "="*30)
        print("TEST CREDENTIALS:")
        print("Admin:     admin@ticketvibez.com / admin123")
        print("Organizer: organizer@ticketvibez.com / organizer123")
        print("Attendee:  attendee@ticketvibez.com / attendee123")
        print("="*30)

if __name__ == "__main__":
    reset_and_seed()
