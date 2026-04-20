import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

dotenv_path = os.path.join(os.getcwd(), '.env')
load_dotenv(dotenv_path)

db_url = os.getenv('DATABASE_URL')
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = Session()

from app.models.event import TicketType, Event

types = session.query(TicketType).all()
print(f"Total TicketTypes found: {len(types)}")
for tt in types:
    print(f"ID: {tt.id}, Name: {tt.name}, EventID: {tt.event_id}, Quantity: {tt.quantity}")

events = session.query(Event).all()
print(f"Total Events found: {len(events)}")
for e in events:
    print(f"ID: {e.id}, Title: {e.title}")

session.close()
