// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaTicketAlt } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "My Tickets", path: "/my-tickets" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getDashboardPath = () => {
    if (!user) return null;
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin";
    if (role === "organizer") return "/organizer";
    return null;
  };

  const getRoleBadgeColor = () => {
    if (!user) return "";
    const role = user.role?.toLowerCase();
    if (role === "admin") return "bg-red-50 text-red-600 border-red-200";
    if (role === "organizer") return "bg-emerald-50 text-emerald-600 border-emerald-200";
    return "bg-blue-5 text-blue-600 border-blue-20";
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-blue-20 py-2"
            : "bg-white/70 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Ticket Vibez"
              className="h-10 w-10 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-outfit font-bold text-xl text-heading">
              Ticket <span className="gradient-text">Vibez</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-primary-dark bg-blue-5"
                    : "text-gray-600 hover:text-primary hover:bg-blue-5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {token && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-blue-20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name || "User"}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border border-blue-20">
                    <div className="p-4 border-b">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="p-2">
                      {getDashboardPath() && (
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-5 rounded"
                        >
                          <FaTachometerAlt /> Dashboard
                        </Link>
                      )}

                      <Link
                        to="/my-tickets"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-5 rounded"
                      >
                        <FaTicketAlt /> My Tickets
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm px-4 py-2">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-4 py-2 bg-primary text-white rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>
    </>
  );
}