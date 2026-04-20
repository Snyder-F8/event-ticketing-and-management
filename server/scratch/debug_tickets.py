import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Path to the .env file
dotenv_path = os.path.join(os.getcwd(), '.env')
load_dotenv(dotenv_path)

db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("DATABASE_URL not found in .env")
    exit(1)

# Fix for postgres:// vs postgresql://
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = Session()

from app.models.ticket import Ticket, Payment
from app.models.user import User

tickets = session.query(Ticket).all()
print(f"Total tickets found: {len(tickets)}")

for t in tickets:
    user = session.query(User).filter_by(id=t.user_id).first()
    print(f"ID: {t.id}, Code: {t.ticket_code}, Status: {t.status}, EventID: {t.event_id}, TypeID: {t.ticket_type_id}")

session.close()
