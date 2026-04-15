import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import AdminDashboard from "../pages/AdminDashboard";
import OrganizerDashboard from "../pages/OrganizerDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}