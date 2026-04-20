// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-blue-950 text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-primary to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Ticket Vibez" className="h-10 w-10 rounded-full object-contain" />
              <span className="font-outfit font-bold text-xl">
                Ticket <span className="text-blue-100">Vibez</span>
              </span>
            </Link>
            <p className="text-sm text-blue-80 leading-relaxed">
              Discover, book, and manage event tickets seamlessly. Your gateway to unforgettable experiences.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[<FaFacebookF />, <FaTwitter />, <FaInstagram />].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-blue-800 flex items-center justify-center text-blue-80 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider mb-4 text-blue-40">Quick Links</h4>
            <ul className="space-y-3">
              {[{ name: "Home", path: "/" }, { name: "Browse Events", path: "/events" }, { name: "My Tickets", path: "/my-tickets" }, { name: "Create Account", path: "/signup" }].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-blue-80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider mb-4 text-blue-40">Categories</h4>
            <ul className="space-y-3">
              {["Music", "Technology", "Sports", "Art & Culture", "Food & Drink", "Education"].map((cat) => (
                <li key={cat}>
                  <Link to={`/events?category=${encodeURIComponent(cat)}`} className="text-sm text-blue-80 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider mb-4 text-blue-40">Contact Us</h4>
            <ul className="space-y-3 text-sm text-blue-80">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary-light flex-shrink-0" /> hello@ticketvibez.com
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary-light flex-shrink-0" /> +254 716 494 310
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary-light flex-shrink-0" /> Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-80">© {new Date().getFullYear()} Ticket Vibez. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-blue-80">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}