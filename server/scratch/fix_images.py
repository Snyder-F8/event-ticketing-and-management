from app import create_app, db
from app.models.event import Event, Image

app = create_app()

updates = {
    "Nairobi Tech Summit 2026": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
    "Sherehe Music Festival": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000",
    "Mombasa Sports Gala": "https://images.unsplash.com/photo-1461896756985-231df397f0a7?auto=format&fit=crop&q=80&w=1000",
    "Cultural Heritage Expo": "https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&q=80&w=1000",
    "Nairobi Food Festival": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000",
    "Hackathon: Build for Africa": "https://images.unsplash.com/photo-1504384308090-c89eec2adc39?auto=format&fit=crop&q=80&w=1000",
    "Theatre Night: Sauti": "https://images.unsplash.com/photo-1503095396549-80725a3a0447?auto=format&fit=crop&q=80&w=1000",
    "Vibez Social Night": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
}

with app.app_context():
    for title, url in updates.items():
        event = Event.query.filter_by(title=title).first()
        if event and event.images:
            event.images[0].image_url = url
            print(f"Updated image for: {title}")
    db.session.commit()
    print("Done updates.")
