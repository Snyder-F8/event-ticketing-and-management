<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx'

function App() {


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/profile/:id" element={<h1>Profile Page</h1>} /> */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
>>>>>>> c109806 (Work in progress: dashboards, auth UI, PWA setup)
  );
}

export default App;