// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Pages — Public
import LandingPage from "./pages/LandingPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage.jsx";

// Pages — Auth
import Signup from "./pages/Signup.jsx";
import Verify from "./pages/Verify.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Pages — Dashboards
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OrganizerDashboard from "./pages/OrganizerDashboard.jsx";

// Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function AppLayout() {
  const location = useLocation();

  // Only dashboards hide the public navbar/footer (they have their own sidebar)
  const noLayoutPaths = ["/admin", "/organizer"];

  const hideLayout = noLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />

          {/* Auth pages (navbar visible so users can navigate to Home/Events) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboards (own layout with sidebar) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppLayout />
      </Router>
    </Provider>
  );
}

export default App;