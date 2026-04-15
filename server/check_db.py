from app import create_app
from app.extensions import db
from app.models.event import Event

app = create_app()
with app.app_context():
    events = Event.query.all()
    print(f"Total events: {len(events)}")
    for e in events:
        print(f"ID: {e.id}, Title: {e.title}, Status: {e.status}")
