import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx'
import Profile from "./pages/Profile.jsx";

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
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App
