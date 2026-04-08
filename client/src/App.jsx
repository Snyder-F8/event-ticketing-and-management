import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";

// Auth Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />

          {/* Dashboards */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;