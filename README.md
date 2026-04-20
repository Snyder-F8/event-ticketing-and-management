# TicketVibez - Event Ticketing and Management System

TicketVibez is a full-stack event ticketing and management platform designed to facilitate event creation, ticket purchasing, and seamless management. 

## Features
- **User Authentication:** Secure sign-up, login, password resets, and email verification.
- **Event Discovery:** Browse upcoming events, view event details, and purchase tickets easily.
- **M-Pesa Integration:** Fully integrated M-Pesa STK push for seamless and instant ticket payments.
- **QR Code Ticketing:** Generates scannable QR code tickets available to download as PDF.
- **Admin Dashboard:** Powerful tools for administrators to manage users, approve events, and track ticket sales via dynamic charts.
- **Email Notifications:** Automated emails via Gmail SMTP for account activation, password resets, and successful ticket delivery.

## Tech Stack
### Frontend (`/client`)
- **Framework:** React with Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Other Tools:** Axios for API requests, Chart.js for analytics, QRCode.react, and jsPDF.

### Backend (`/server`)
- **Framework:** Flask (Python)
- **Database:** PostgreSQL with SQLAlchemy & Alembic (Flask-Migrate)
- **Authentication:** Flask-JWT-Extended
- **Email:** Python `smtplib` (Gmail SMTP)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL database
- M-Pesa Daraja API Credentials (for payment testing)
- Gmail account with an App Password (for SMTP)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables: 
   Create a `.env` file in the `server` directory and add your application secrets:
   ```env
   SECRET_KEY=your_secret_key
   JWT_SECRET_KEY=your_jwt_secret
   DATABASE_URL=postgresql://user:password@localhost/dbname
   
   # Email Config
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your_gmail_address
   MAIL_PASSWORD=your_app_password
   
   # M-Pesa Config
   MPESA_ENVIRONMENT=sandbox
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   ```
5. Apply database migrations:
   ```bash
   flask db upgrade
   ```
6. Start the Flask development server:
   ```bash
   flask run --debug
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## License
This project is licensed under the terms of the LICENSE file included in the repository.
