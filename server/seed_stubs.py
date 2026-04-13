from datetime import datetime, timedelta
from app import create_app, db
from app.models.user import Role, User
from app.models.category import Category
from app.models.event import Event, TicketType, Image
from werkzeug.security import generate_password_hash

app = create_app()

def seed_stubs():
    with app.app_context():
        print("Starting stub seeding...")
        
        # 1. Ensure Categories
        categories_names = ["Music", "Technology", "Sports", "Art & Culture", "Food & Drink", "Theatre", "Education"]
        for cname in categories_names:
            if not Category.query.filter_by(name=cname).first():
                db.session.add(Category(name=cname))
        db.session.commit()
        
        # 2. Get Organizer
        organizer = User.query.filter_by(email="organizer@example.com").first()
        if not organizer:
            print("Organizer user not found. Please run seed.py first.")
            return

        # 3. Stub Data (from stubEvents.js)
        stubs = [
            {
                "title": "Nairobi Tech Summit 2026",
                "description": "Join 2000+ tech professionals for Kenya's biggest technology conference.",
                "location": "KICC, Nairobi",
                "image": "tech.jpg",
                "category": "Technology",
                "tickets": [{"name": "Early Bird", "price": 1500, "quantity": 200}, {"name": "Regular", "price": 2500, "quantity": 500}]
            },
            {
                "title": "Sherehe Music Festival",
                "description": "The ultimate outdoor music experience! Three stages, 40+ artists.",
                "location": "Uhuru Gardens, Nairobi",
                "image": "sherehe.jpg",
                "category": "Music",
                "tickets": [{"name": "Regular", "price": 2000, "quantity": 3000}]
            },
            {
                "title": "Mombasa Sports Gala",
                "description": "Annual inter-county sports competition featuring football, rugby, and more.",
                "location": "Mombasa Stadium",
                "image": "sport.jpg",
                "category": "Sports",
                "tickets": [{"name": "Regular", "price": 500, "quantity": 5000}]
            },
            {
                "title": "Cultural Heritage Expo",
                "description": "Celebrate Kenya's diverse cultural heritage with traditional dances.",
                "location": "Bomas of Kenya, Nairobi",
                "image": "culture.png",
                "category": "Art & Culture",
                "tickets": [{"name": "Regular", "price": 800, "quantity": 2000}]
            },
            {
                "title": "Nairobi Food Festival",
                "description": "A culinary journey through Kenyan and international cuisines.",
                "location": "Karura Forest, Nairobi",
                "image": "food.jpg",
                "category": "Food & Drink",
                "tickets": [{"name": "Regular", "price": 1200, "quantity": 1000}]
            },
            {
                "title": "Hackathon: Build for Africa",
                "description": "48-hour hackathon challenging developers to build innovative solutions.",
                "location": "iHub, Nairobi",
                "image": "hackathon.png",
                "category": "Technology",
                "tickets": [{"name": "Regular", "price": 0, "quantity": 300}]
            },
            {
                "title": "Theatre Night: Sauti",
                "description": "An award-winning Swahili play exploring themes of identity and love.",
                "location": "Kenya National Theatre",
                "image": "theatre.jpg",
                "category": "Theatre",
                "tickets": [{"name": "Regular", "price": 1500, "quantity": 400}]
            },
            {
                "title": "Vibez Social Night",
                "description": "Monthly social mixer with live DJs, cocktails, and networking.",
                "location": "Alchemist, Nairobi",
                "image": "vibe.jpg",
                "category": "Music",
                "tickets": [{"name": "Regular", "price": 1000, "quantity": 200}]
            }
        ]

        BASE_IMAGE_URL = "http://localhost:5000/static/uploads/stubs"

        for i, s in enumerate(stubs):
            existing_event = Event.query.filter_by(title=s["title"]).first()
            if not existing_event:
                event = Event(
                    title=s["title"],
                    description=s["description"],
                    location=s["location"],
                    event_date=datetime.now() + timedelta(days=30 + i*5),
                    status="approved",
                    organizer_id=organizer.id
                )
                db.session.add(event)
                
                # Category
                cat = Category.query.filter_by(name=s["category"]).first()
                if cat:
                    event.categories.append(cat)
                
                db.session.flush()
                
                # Tickets
                for t in s["tickets"]:
                    db.session.add(TicketType(
                        event_id=event.id,
                        name=t["name"],
                        price=t["price"],
                        quantity=t["quantity"]
                    ))
                
                # Image
                db.session.add(Image(
                    event_id=event.id,
                    image_url=f"{BASE_IMAGE_URL}/{s['image']}"
                ))
            else:
                print(f"Skipping '{s['title']}' - already exists.")
        
        db.session.commit()
        print("Stub events seeded successfully.")
        
        db.session.commit()
        print("Stub events seeded successfully.")

if __name__ == "__main__":
    seed_stubs()
